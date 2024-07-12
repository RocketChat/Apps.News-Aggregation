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
import { NewsItemPersistence } from '../persistence/NewsItemPersistence';
import { BBCAdapter } from '../adapters/source-adapters/BBCAdapter';

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

	async fetchNewsAndStore(read: IRead, modify: IModify, http: IHttp) {
		let news: NewsItem[] = [];
		const techCrunchAdapter = new TechCrunchAdapter();
		const bbcAdapter = new BBCAdapter();
		const techCrunchNewsSource = new NewsSource(techCrunchAdapter, news);
		const bbcNewsSource = new NewsSource(bbcAdapter, news);

		news = [
			...(await techCrunchNewsSource.fetchNews(
				read,
				modify,
				http,
				this.persistence
			)),
			...(await bbcNewsSource.fetchNews(read, modify, http, this.persistence)),
			// add more sources
		];

		// to fetch and store news manually as scheduler not working
		// await techCrunchNewsSource.saveNews(this.persistence, this.persistenceRead);

		const newsStorage = new NewsItemPersistence(
			this.app,
			this.persistence,
			this.persistenceRead
		);
		try {
			for (const item of news) {
				await newsStorage.saveNews(item, 'TechCrunch');
			}
			console.log('all news-items saved!!');
		} catch (err) {
			console.error('News Items could not be save', err);
			this.app.getLogger().error('News Items could not be save', err);
		}
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
		const techCrunchNewsSource = new NewsSource(techCrunchAdapter, news);

		try {
			// await techCrunchNewsSource.deleteNews(read, modify, room, http, persis);
			console.log('all news deleted!');
		} catch (err) {
			console.error(err);
		}
	}
}
