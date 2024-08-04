import {
	IRead,
	IModify,
	IHttp,
	IPersistence,
} from '@rocket.chat/apps-engine/definition/accessors';
import { NewsAggregationApp } from '../../../NewsAggregationApp';
import { NewsItem } from '../../../definitions/NewsItem';
import { INewsSourceAdapter } from '../INewsSourceAdapter';
import * as https from 'https';
import { randomBytes, createHash } from 'crypto';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { createTextCompletion } from '../../utils/createTextCompletion';
import { generateRandomId } from '../../utils/generateRandomId';

// type AtLeast<T, K extends keyof T> = Partial<T> & { [P in K]: T[P] };

/**
 * BBCAdapter class implements INewsSourceAdapter.
 * Handles fetching and categorizing news from BBC RSS feeds.
 */
export class BBCAdapter implements INewsSourceAdapter {
	app: NewsAggregationApp;
	newsItems: NewsItem[] = [];
	fetchUrl: string = `https://feeds.bbci.co.uk/news/rss.xml`;

	/**
	 * Fetches news items from the BBC RSS feed and transforms them into NewsItem format.
	 * @returns A promise that resolves to an array of NewsItem
	 */
	public async fetchNews(
		read: IRead,
		modify: IModify,
		http: IHttp,
		persis: IPersistence
	): Promise<NewsItem[]> {
		await (async () => {
			try {
				this.newsItems = await this.fetchRssFeed(this.fetchUrl);
				console.log('bbcnews: ', this.newsItems);
				console.log('fetched from bbc');
			} catch (error) {
				console.error('Error processing RSS feed:', error);
			}
		})();

		console.log('bbcc fetch working');

		return this.newsItems;
	}

	/**
	 * Determines categories for the fetched news items using text completion.
	 * @returns A promise that resolves to the categories of the news items
	 */
	public async determineCategory(
		newsItems: NewsItem[],
		read: IRead,
		room: IRoom,
		user: IUser,
		modify: IModify,
		http: IHttp
	) {
		const prompts = newsItems.map((newsItem) => ({
			id: newsItem?.id,
			prompt: newsItem?.description,
		}));
		console.log('prmot', prompts);
		// this.app.getLogger().info(prompts);
		// modify.

		console.log('lol');

		const categories = await createTextCompletion(
			read,
			room,
			user,
			modify,
			http,
			prompts
		);
		console.log('llm-responsebbc: ', categories);

		return categories;
	}

	/**
	 * Fetches RSS feed from the specified URL.
	 * @param url - URL of the RSS feed
	 * @returns A promise that resolves to an array of NewsItem
	 */
	async fetchRssFeed(url: string): Promise<NewsItem[]> {
		try {
			const response = await new Promise<string>((resolve, reject) => {
				https.get(url, (res) => {
					let data = '';

					res.on('data', (chunk) => {
						data += chunk;
					});

					res.on('end', () => {
						resolve(data);
					});

					res.on('error', (err) => {
						reject(err);
					});
				});
			});

			const items = this.parseRssItems(response);
			return items;
		} catch (error) {
			console.error('Error fetching RSS feed:', error);
			throw error;
		}
	}

	/**
	 * Parses RSS XML to extract news items.
	 * @param xml - RSS XML string
	 * @returns A promise that resolves to an array of NewsItem
	 */
	async parseRssItems(xml: string): Promise<NewsItem[]> {
		const items: NewsItem[] = [];
		const itemRegex = /<item>([\s\S]*?)<\/item>/g;
		let match: RegExpExecArray | null;
		// let id = 1;

		while ((match = itemRegex.exec(xml)) !== null) {
			const item = match[1];
			const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
			const descriptionMatch = item.match(
				/<description><!\[CDATA\[(.*?)\]\]><\/description>/
			);
			const linkMatch = item.match(/<link>(.*?)<\/link>/);
			const publishDateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);
			const imageMatch = item.match(/<media:thumbnail[^>]*url="(.*?)"/);

			if (
				titleMatch &&
				linkMatch &&
				descriptionMatch &&
				publishDateMatch &&
				imageMatch
			) {
				items.push({
					id: generateRandomId({
						source: 'BBC',
						title: titleMatch[1],
					}),
					title: titleMatch[1],
					description: descriptionMatch[1],
					link: linkMatch[1],
					image: imageMatch[1],
					source: 'BBC',
					author: 'NA',
					publishedAt: new Date(publishDateMatch[1]),
				});
				// id++;
			}
		}
		return items.slice(0, 10);
	}
}
