import {
	IHttp,
	IModify,
	IPersistence,
	IPersistenceRead,
	IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { NewsAggregationApp } from '../NewsAggregationApp';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { TechCrunchAdapter } from '../adapters/source-adapters/TechCrunchAdapter';
import { NewsSource } from '../definitions/NewsSource';
import { NewsItem } from '../definitions/NewsItem';

export class NewsFetchService {
	app: NewsAggregationApp;
	persistence: IPersistence;
	persistenceRead: IPersistenceRead;

	constructor(
		app: NewsAggregationApp,
		persistence: IPersistence,
		persistenceRead: IPersistenceRead
	) {
		this.app = app;
		this.persistence = persistence;
		this.persistenceRead = persistenceRead;
	}

	async fetchNewsAndStore(
		read: IRead,
		modify: IModify,
		room: IRoom,
		http: IHttp
	) {
		let news: NewsItem[] = [];
		const techCrunchAdapter = new TechCrunchAdapter();
		const techCrunchNewsSource = new NewsSource(
			this.app,
			techCrunchAdapter,
			news
		);

		news = await techCrunchNewsSource.fetchNews(
			read,
			modify,
			room,
			http,
			this.persistence
		);

		await techCrunchNewsSource.saveNews(this.persistence, this.persistenceRead);
	}

	async deleteNewsScheduler(
		read: IRead,
		modify: IModify,
		room: IRoom,
		http: IHttp,
		persis: IPersistence
	) {
		let news: NewsItem[] = [];
		const techCrunchAdapter = new TechCrunchAdapter();
		const techCrunchNewsSource = new NewsSource(
			this.app,
			techCrunchAdapter,
			news
		);

		try {
			await techCrunchNewsSource.deleteNews(read, modify, room, http, persis);
			console.log('all news deleted!');
		} catch (err) {
			console.error(err);
		}
	}
}
