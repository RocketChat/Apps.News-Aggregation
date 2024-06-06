import {
	IHttp,
	IModify,
	IPersistence,
	IPersistenceRead,
	IRead,
} from '@rocket.chat/apps-engine/definition/accessors';

import { NewsAggregationApp } from '../NewsAggregationApp';

import { NewsItem } from './NewsItem';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { INewsSourceAdapter } from '../adapters/INewsSourceAdapter';

export class NewsSource {
	private adapter: INewsSourceAdapter;
	app: NewsAggregationApp;
	news: NewsItem[] = [];

	constructor(
		app: NewsAggregationApp,
		adapter: INewsSourceAdapter,
		news: NewsItem[]
	) {
		this.app = app;
		this.adapter = adapter;
		this.news = news;
	}

	async fetchNews(
		read: IRead,
		modify: IModify,
		room: IRoom,
		http: IHttp,
		persis: IPersistence
	): Promise<NewsItem[]> {
		return this.adapter.fetchNews(read, modify, room, http, persis);
	}

	async saveNews(
		persistence: IPersistence,
		persistenceRead: IPersistenceRead
	): Promise<any> {
		return this.adapter.saveNews(persistence, persistenceRead);
	}

	async getNews(
		read: IRead,
		modify: IModify,
		room: IRoom,
		http: IHttp,
		persistenceRead: IPersistenceRead
	): Promise<any> {}
}
