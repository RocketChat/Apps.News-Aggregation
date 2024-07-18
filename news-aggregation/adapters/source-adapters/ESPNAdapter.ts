import * as https from 'https';
import { randomBytes } from 'crypto';
import { NewsAggregationApp } from '../../NewsAggregationApp';
import { NewsItem } from '../../definitions/NewsItem';
import { INewsSourceAdapter } from '../INewsSourceAdapter';
import {
	IHttp,
	IModify,
	IPersistence,
	IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { createTextCompletion } from '../../utils/createTextCompletion';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { newsCategoryPrompt } from '../../utils/prompts';

export class ESPNAdapter implements INewsSourceAdapter {
	app: NewsAggregationApp;
	newsItems: NewsItem[] = [];
	fetchUrl: string = `https://www.espn.com/espn/rss/news`;

	private generateRandomId(length: number = 16): string {
		return randomBytes(length).toString('hex');
	}

	public async fetchNews(
		read: IRead,
		modify: IModify,
		http: IHttp,
		persis: IPersistence
	): Promise<NewsItem[]> {
		await (async () => {
			try {
				this.newsItems = await this.fetchRssFeed(this.fetchUrl);
			} catch (error) {
				console.error('Error processing RSS feed:', error);
			}
		})();

		return this.newsItems;
	}

	public async determineCategory(
		newsItem: NewsItem,
		read: IRead,
		room: IRoom,
		user: IUser,
		modify: IModify,
		http: IHttp
	): Promise<string> {
		const prompt = newsCategoryPrompt(newsItem.description);
		const category = await createTextCompletion(
			read,
			room,
			user,
			modify,
			http,
			prompt
		);
		console.log('llm-response: ', category);

		return '';
	}

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
					id: this.generateRandomId(),
					title: titleMatch[1],
					description: descriptionMatch[1],
					link: linkMatch[1],
					image: imageMatch[1],
					source: 'ESPN',
					publishedAt: new Date(publishDateMatch[1]),
				});
				// id++;
			}
		}
		return items;
	}
}
