import {
	IHttp,
	IModify,
	IPersistence,
	IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { NewsAggregationApp } from '../NewsAggregationApp';
import { NewsItem } from './NewsItem';
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

	public async fetchNews(
		read: IRead,
		modify: IModify,
		http: IHttp,
		persis: IPersistence
	): Promise<NewsItem[]> {
		return this.adapter.fetchNews(read, modify, http, persis);
	}
}
