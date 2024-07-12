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
import { NewsAggregationApp } from '../NewsAggregationApp';
import { TechCrunchAdapter } from '../adapters/source-adapters/TechCrunchAdapter';
import { BBCAdapter } from '../adapters/source-adapters/BBCAdapter';
import { NewsSource } from '../definitions/NewsSource';
import { NewsItem } from '../definitions/NewsItem';

export class FetchNewsProcessor implements IProcessor {
	id: string = 'fetch-news';
	app: NewsAggregationApp;
	newsItems: NewsItem[] = [];

	constructor(app: NewsAggregationApp) {
		this.app = app;
		console.log('cons', app);
		console.log('this', this.app);
	}

	public async processor(
		jobContext: IJobContext,
		read: IRead,
		modify: IModify,
		http: IHttp,
		persis: IPersistence
	): Promise<void> {
		console.log('fetch-processor-working');

		const data = jobContext;
		const persisRead = read.getPersistenceReader();
		console.log('fetch-processor-working1');

		const techCrunchAdapter = new TechCrunchAdapter();
		console.log('hello');
		console.log(this);
		const bbcAdapter = new BBCAdapter();

		const techCrunchNewsSource = new NewsSource(
			techCrunchAdapter,
			this.newsItems
		);
		console.log('fetch-processor-working2');
		const bbcNewsSource = new NewsSource(bbcAdapter, this.newsItems);
		console.log('fetch-processor-working2.1');

		// Fetch news items from sources
		this.newsItems = [
			...(await techCrunchNewsSource.fetchNews(read, modify, http, persis)),
			...(await bbcNewsSource.fetchNews(read, modify, http, persis)),
			// add more sources
		];
		console.log('fetch-processor-working3');

		const newsStorage = new NewsItemPersistence(this.app, persis, persisRead);
		try {
			const saveNews = this.newsItems.map((newsItem) =>
				newsStorage.saveNews(newsItem, 'TechCrunch')
			);
			await Promise.all(saveNews);
			console.log('all news-items saved!!');
		} catch (err) {
			console.error('News Items could not be save', err);
			this.app.getLogger().error('News Items could not be save', err);
		}

		console.log('Data', data);
		console.log('FetchNewsProcessor completed.');
	}
}
