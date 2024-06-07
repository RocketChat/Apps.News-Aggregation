import {
	IPersistence,
	IPersistenceRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { NewsAggregationApp } from '../NewsAggregationApp';

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

	async fetchNews(
		persistence: IPersistence,
		persistenceRead: IPersistenceRead
	) {}
}
