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
import { SettingEnum } from '../enums/settingEnum';
import { IUser } from '@rocket.chat/apps-engine/definition/users';

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
		http: IHttp,
		room: IRoom
	) {
		const appUser = (await read.getUserReader().getAppUser()) as IUser;
		let news: NewsItem[] = [];
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

		if (techCrunchSetting.value) {
			const techCrunchAdapter = new TechCrunchAdapter();
			const techCrunchNewsSource = new NewsSource(techCrunchAdapter, news);
			news = [
				...news,
				...(await techCrunchNewsSource.fetchNews(
					read,
					modify,
					http,
					this.persistence
				)),
			];

			for (const newsItem of news) {
				// const res = await techCrunchNewsSource.determineCategory(
				// 	newsItem,
				//     read,
				// 	http
				// );
				// this.app.getLogger().info('catsfs: ', res);
				// console.log('catsfs: ', res);
			}
		}

		if (bbcSetting.value) {
			const bbcAdapter = new BBCAdapter();
			const bbcNewsSource = new NewsSource(bbcAdapter, news);
			news = [
				...news,
				...(await bbcNewsSource.fetchNews(
					read,
					modify,
					http,
					this.persistence
				)),
			];

			for (const newsItem of news) {
				const newsCategory = await bbcNewsSource.determineCategory(
					newsItem,
					read,
					room,
					appUser,
					modify,
					http
				);

				newsItem.category = newsCategory;
				console.log('fnsCat: ', newsCategory);
			}
		}

		console.log('newsafterfetch: ', news);

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
