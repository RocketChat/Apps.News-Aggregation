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

export class FetchNewsProcessors implements IProcessor {
	id: string = 'fetch-news';

	async processor(
		jobContext: IJobContext,
		read: IRead,
		modify: IModify,
		http: IHttp,
		persis: IPersistence
	): Promise<void> {
		const data = jobContext;
		console.log('Data', data);
	}
}
