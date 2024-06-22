import {
	IPersistence,
	IPersistenceRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { NewsAggregationApp } from '../NewsAggregationApp';
import { NewsItemPersistence } from '../persistence/NewsItemPersistence';
import { NewsItem } from '../definitions/NewsItem';

export class NewsDeliveryService {
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

	public async deliverDailyNews() {
		const newsStorage = new NewsItemPersistence(
			this.app,
			this.persistence,
			this.persistenceRead
		);
		const newsFromStorage = await newsStorage.getAllNews();
		console.log('newss', newsFromStorage);

		const dailyTask = {
			id: 'fetch-news',
			interval: '* * * * *',
			data: {
				news: newsFromStorage,
			},
		};

		return dailyTask;
	}
}
