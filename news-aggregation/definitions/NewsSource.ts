import {
	IHttp,
	IModify,
	IPersistence,
	IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { NewsAggregationApp } from '../NewsAggregationApp';
import { NewsItem } from './NewsItem';
import { INewsSourceAdapter } from '../src/adapters/INewsSourceAdapter';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';

export class NewsSource {
	adapter: INewsSourceAdapter;

	constructor(adapter: INewsSourceAdapter) {
		this.adapter = adapter;
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
		newsItems: NewsItem[],
		read: IRead,
		room: IRoom,
		user: IUser,
		modify: IModify,
		http: IHttp
	) {
		return this.adapter.determineCategory(
			newsItems,
			read,
			room,
			user,
			modify,
			http
		);
	}
}
