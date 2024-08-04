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
import { NewsItemPersistence } from '../persistence/NewsItemPersistence';
import { NewsItem } from '../../definitions/NewsItem';

export class DeleteNewsProcessor implements IProcessor {
	id: string = 'delete-news';

	async processor(
		jobContext: IJobContext,
		read: IRead,
		modify: IModify,
		http: IHttp,
		persis: IPersistence
	): Promise<void> {
		const payload = jobContext;
		console.log('DELETED!! delete-payload', payload);

		const newsStorage = new NewsItemPersistence({
			read: read,
			modify: modify,
			persistence: persis,
		});
		const allNews = (await newsStorage.getAllNews()) as NewsItem[];
		console.log('allnewsfordelete', allNews);

		// Sort the news array by publishedAt date in descending order
		allNews.sort((a, b) => {
			const dateA = new Date(a.publishedAt || 0).getTime();
			const dateB = new Date(b.publishedAt || 0).getTime();
			return dateB - dateA;
		});

		// Slice the array to get the oldest 5 news
		const oldestNews = allNews.slice(-5);

		for (const news of oldestNews) {
			await newsStorage.removeNewsById(news);
			console.log('old news deleted');
		}

		// Remove the oldest 5 news from the main array
		const updatedNews = allNews.slice(0, allNews.length - 5);

		console.log('oldestNews', oldestNews);
		console.log('updatedNews', updatedNews);

		// Further processing with updatedNews if needed

		console.log('delete processor finishedd');
	}
}
