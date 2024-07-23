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
import { generateRandomId } from '../../utils/generateRandomId';

export class ESPNAdapter implements INewsSourceAdapter {
	app: NewsAggregationApp;
	newsItems: NewsItem[] = [];
	fetchUrl: string = `https://www.espn.com/espn/rss/news`;

	public async fetchNews(
		read: IRead,
		modify: IModify,
		http: IHttp,
		persis: IPersistence
	): Promise<NewsItem[]> {
		await (async () => {
			try {
				this.newsItems = await this.fetchRssFeed(this.fetchUrl);
				console.log('espn news: ', this.newsItems);
				console.log('fetched from espn');
			} catch (error) {
				console.error('Error processing RSS feed:', error);
			}
		})();

		console.log('espn fetch working');

		return this.newsItems;
	}

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

		console.log('lol');

		const categories = await createTextCompletion(
			read,
			room,
			user,
			modify,
			http,
			prompts
		);
		console.log('llm-responseespn: ', categories);

		return categories;
	}

	async fetchRssFeed(url: string): Promise<NewsItem[]> {
		try {
			const response = await new Promise<string>((resolve, reject) => {
				https
					.get(url, (res) => {
						let data = '';

						res.on('data', (chunk) => {
							data += chunk;
						});

						res.on('end', () => {
							if (res.statusCode === 200) {
								resolve(data);
							} else {
								reject(
									new Error(`Failed to fetch RSS feed: ${res.statusCode}`)
								);
							}
						});

						res.on('error', (err) => {
							reject(err);
						});
					})
					.on('error', (err) => {
						reject(err);
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

		while ((match = itemRegex.exec(xml)) !== null) {
			const item = match[1];
			const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
			const descriptionMatch = item.match(
				/<description><!\[CDATA\[(.*?)\]\]><\/description>/
			);
			const creatorMatch = item.match(
				/<dc:creator><!\[CDATA\[(.*?)\]\]><\/dc:creator>/
			);
			const enclosureMatch = item.match(/<enclosure[^>]*url="(.*?)"/);
			const linkMatch = item.match(/<link><!\[CDATA\[(.*?)\]\]><\/link>/);
			const publishDateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);

			if (titleMatch && linkMatch && descriptionMatch && publishDateMatch) {
				items.push({
					id: generateRandomId({
						source: 'ESPN',
						title: titleMatch[1],
					}),
					title: titleMatch[1],
					description: descriptionMatch[1],
					link: linkMatch[1],
					image: enclosureMatch ? enclosureMatch[1] : '',
					source: 'ESPN',
					author: creatorMatch ? creatorMatch[1] : 'NA',
					publishedAt: new Date(publishDateMatch[1]),
				});
			} else {
				console.warn('Incomplete RSS item found:', {
					titleMatch,
					descriptionMatch,
					linkMatch,
					publishDateMatch,
					enclosureMatch,
					creatorMatch,
				});
			}
		}
		return items.slice(0, 10);
	}
}
