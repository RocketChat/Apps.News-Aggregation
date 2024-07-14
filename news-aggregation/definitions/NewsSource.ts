import {
	IHttp,
	IModify,
	IPersistence,
	IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { NewsAggregationApp } from '../NewsAggregationApp';
import { NewsItem } from './NewsItem';
import { INewsSourceAdapter } from '../adapters/INewsSourceAdapter';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';

export class NewsSource {
	private adapter: INewsSourceAdapter;
	news: NewsItem[] = [];

	constructor(adapter: INewsSourceAdapter, news: NewsItem[]) {
		this.adapter = adapter;
		this.news = news;
	}

	public async fetchNews(
		read: IRead,
		modify: IModify,
		http: IHttp,
		persis: IPersistence
	): Promise<NewsItem[]> {
		return this.adapter.fetchNews(read, modify, http, persis);
	}

	public async determineCategory(
		newsItem: NewsItem,
		read: IRead,
		room: IRoom,
		user: IUser,
		modify: IModify,
		http: IHttp
	): Promise<string[]> {
		return this.adapter.determineCategory(
			newsItem,
			read,
			room,
			user,
			modify,
			http
		);
	}
}
