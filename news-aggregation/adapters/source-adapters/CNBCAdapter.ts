import {
	IRead,
	IModify,
	IHttp,
	IPersistence,
} from '@rocket.chat/apps-engine/definition/accessors';
import { NewsAggregationApp } from '../../NewsAggregationApp';
import { NewsItem } from '../../definitions/NewsItem';
import { INewsSourceAdapter } from '../INewsSourceAdapter';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { createTextCompletion } from '../../utils/createTextCompletion';
import { generateRandomId } from '../../utils/generateRandomId';
import * as https from 'https';

export class CNBCAdapter implements INewsSourceAdapter {
	app: NewsAggregationApp;
	newsItems: NewsItem[] = [];
	fetchUrl: string = `https://www.cnbctv18.com/commonfeeds/v1/cne/rss/latest.xml`;

	public async fetchNews(
		read: IRead,
		modify: IModify,
		http: IHttp,
		persis: IPersistence
	): Promise<NewsItem[]> {
		await (async () => {
			try {
				this.newsItems = await this.fetchRssFeed(this.fetchUrl);
				console.log('cnbc news: ', this.newsItems);
				console.log('fetched from cnbc');
			} catch (error) {
				console.error('Error processing RSS feed:', error);
			}
		})();

		console.log('cnbc fetch working');

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
		console.log('prompt', prompts);

		console.log('lol');

		const categories = await createTextCompletion(
			read,
			room,
			user,
			modify,
			http,
			prompts
		);
		console.log('llm-responsecnbc: ', categories);

		return categories;
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

		while ((match = itemRegex.exec(xml)) !== null) {
			const item = match[1];
			const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
			if (titleMatch) {
				console.log('title matched');
			}
			const descriptionMatch = item.match(
				/<description><!\[CDATA\[(.*?)\]\]><\/description>/
			);
			if (descriptionMatch) {
				console.log('desc matched');
			}
			const creatorMatch = item.match(
				/<dc:creator(?:><!\[CDATA\[|\>)(.*?)(?:\]\]><\/dc:creator>|\<\/dc:creator>)/
			);
			if (creatorMatch) {
				console.log('creator matched');
			}

			const enclosureMatch = item.match(/<media:content[^>]*url="(.*?)"/);
			if (enclosureMatch) {
				console.log('enc match');
			}
			const linkMatch = item.match(/<link><!\[CDATA\[(.*?)\]\]><\/link>/);
			if (linkMatch) {
				console.log('link match');
			}
			const publishDateMatch = item.match(
				/<pubDate><!\[CDATA\[(.*?)\]\]><\/pubDate>/
			);
			if (publishDateMatch) {
				console.log('pub match');
			}
			const categoryMatch = item.match(
				/<category><!\[CDATA\[(.*?)\]\]><\/category>/
			);
			if (categoryMatch) {
				console.log('cat match');
			}

			if (titleMatch && linkMatch && descriptionMatch && publishDateMatch) {
				items.push({
					id: generateRandomId({
						source: 'CNBC',
						title: titleMatch[1],
					}),
					title: titleMatch[1],
					description: descriptionMatch[1],
					link: linkMatch[1],
					image: enclosureMatch ? enclosureMatch[1] : '',
					source: 'CNBC',
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
					categoryMatch,
				});
			}
		}
		return items.slice(0, 10);
	}
}
