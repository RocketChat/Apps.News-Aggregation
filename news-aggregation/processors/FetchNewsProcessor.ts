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
import { SettingEnum } from '../enums/settingEnum';

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

		const settingsReader = read.getEnvironmentReader().getSettings();
		const techCrunchSetting = await settingsReader.getById(
			SettingEnum.TECHCRUNCH
		);
		const bbcSetting = await settingsReader.getById(SettingEnum.BBC);
		console.log(
			JSON.stringify(techCrunchSetting, null, 2) +
				' -- ' +
				JSON.stringify(bbcSetting, null, 2)
		);
		console.log('fetch-processor-working1.1');
		// Fetch news items from sources
		if (techCrunchSetting.value) {
			const techCrunchAdapter = new TechCrunchAdapter();
			console.log('hello');
			console.log(this);
			const techCrunchNewsSource = new NewsSource(
				techCrunchAdapter,
				this.newsItems
			);
			this.newsItems = [
				...this.newsItems,
				...(await techCrunchNewsSource.fetchNews(read, modify, http, persis)),
			];
			console.log('fetch-processor-working2');
		}

		if (bbcSetting.value) {
			const bbcAdapter = new BBCAdapter();

			const bbcNewsSource = new NewsSource(bbcAdapter, this.newsItems);
			console.log('fetch-processor-working2.1');
			this.newsItems = [
				...this.newsItems,
				...(await bbcNewsSource.fetchNews(read, modify, http, persis)),
			];
		}

		console.log('fetch-processor-working3');

		const newsStorage = new NewsItemPersistence({
			read: read,
			modify: modify,
			persistence: persis,
		});
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
