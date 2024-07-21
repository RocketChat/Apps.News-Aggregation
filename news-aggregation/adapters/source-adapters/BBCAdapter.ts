import {
	IRead,
	IModify,
	IHttp,
	IPersistence,
} from '@rocket.chat/apps-engine/definition/accessors';
import { NewsAggregationApp } from '../../NewsAggregationApp';
import { NewsItem } from '../../definitions/NewsItem';
import { INewsSourceAdapter } from '../INewsSourceAdapter';
import * as https from 'https';
import { randomBytes } from 'crypto';

export class BBCAdapter implements INewsSourceAdapter {
	app: NewsAggregationApp;
	newsItems: NewsItem[] = [];
	fetchUrl: string = `https://feeds.bbci.co.uk/news/rss.xml`;

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
				console.log('bbcnews: ', this.newsItems);
				console.log('fetched from bbc');
			} catch (error) {
				console.error('Error processing RSS feed:', error);
			}
		})();

		return this.newsItems;
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
					source: 'BBC',
					author: 'NA',
					publishedAt: new Date(publishDateMatch[1]),
				});
				// id++;
			}
		}
		return items;
	}
}
