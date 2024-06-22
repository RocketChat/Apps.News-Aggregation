import {
	IRead,
	IModify,
	IHttp,
	IPersistence,
} from '@rocket.chat/apps-engine/definition/accessors';
import {
	IJobContext,
	IProcessor,
} from '@rocket.chat/apps-engine/definition/scheduler';
import { NewsDeliveryService } from '../services/NewsDeliveryService';
import { NewsItemPersistence } from '../persistence/NewsItemPersistence';
import { NewsAggregationApp } from '../NewsAggregationApp';

export class FetchNewsProcessors implements IProcessor {
	id: string = 'fetch-news';
	private app: NewsAggregationApp;

	public constructor(app: NewsAggregationApp) {
		this.app = app;
	}

	async processor(
		jobContext: IJobContext,
		read: IRead,
		modify: IModify,
		http: IHttp,
		persis: IPersistence
	): Promise<void> {
		const data = jobContext;
		const persisRead = read.getPersistenceReader();
		const newsStorage = new NewsItemPersistence(this.app, persis, persisRead);
		const newsFromStorage = await newsStorage.getAllNews();
		console.log('newss', newsFromStorage);
		console.log('Data', data);
	}
}
