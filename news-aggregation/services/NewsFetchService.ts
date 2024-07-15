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
import { IConfig } from '../definitions/IConfig';
import { ESPNAdapter } from '../adapters/source-adapters/ESPNAdapter';

export class NewsFetchService {
	// app: NewsAggregationApp;
	// persistence: IPersistence;
	// persistenceRead: IPersistenceRead;
	config: IConfig;

	constructor(
		config: IConfig
		// app: NewsAggregationApp,
		// persistence: IPersistence,
		// persistenceRead: IPersistenceRead
	) {
		this.config = config;
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
		const espnSetting = await settingsReader.getById(SettingEnum.ESPN);
		console.log(
			JSON.stringify(techCrunchSetting, null, 2) +
				' -- ' +
				JSON.stringify(bbcSetting, null, 2)
		);

		if (techCrunchSetting.value) {
			const techCrunchAdapter = new TechCrunchAdapter();
			const techCrunchNewsSource = new NewsSource(techCrunchAdapter);
			news = [
				...news,
				...(await techCrunchNewsSource.fetchNews(
					read,
					modify,
					http,
					this.config.persistence
				)),
			];
		}

		if (bbcSetting.value) {
			const bbcAdapter = new BBCAdapter();
			const bbcNewsSource = new NewsSource(bbcAdapter);
			news = [
				...news,
				...(await bbcNewsSource.fetchNews(
					read,
					modify,
					http,
					this.config.persistence
				)),
			];
		}

		if (espnSetting.value) {
			const espnAdapter = new ESPNAdapter();
			const espnNewsSource = new NewsSource(espnAdapter);
			news = [
				...news,
				...(await espnNewsSource.fetchNews(
					read,
					modify,
					http,
					this.config.persistence
				)),
			];
		}
		console.log('newsafterfetch: ', news);

		if (techCrunchSetting.value) {
			const techCrunchAdapter = new TechCrunchAdapter();
			const techCrunchNewsSource = new NewsSource(techCrunchAdapter);
			news = [
				...news,
				...(await techCrunchNewsSource.fetchNews(
					read,
					modify,
					http,
					this.config.persistence
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
			const bbcNewsSource = new NewsSource(bbcAdapter);
			news = [
				...news,
				...(await bbcNewsSource.fetchNews(
					read,
					modify,
					http,
					this.config.persistence
				)),
			];

			const categories = await bbcNewsSource.determineCategory(
				news,
				read,
				room,
				appUser,
				modify,
				http
			);
			console.log('fnsCat: ', categories);
		}

		if (espnSetting.value) {
			const espnAdapter = new ESPNAdapter();
			const espnNewsSource = new NewsSource(espnAdapter);
			news = [
				...news,
				...(await espnNewsSource.fetchNews(
					read,
					modify,
					http,
					this.config.persistence
				)),
			];
		}

		console.log('newsafterfetch: ', news);

		// to fetch and store news manually as scheduler not working
		// await techCrunchNewsSource.saveNews(this.persistence, this.persistenceRead);

		const newsStorage = new NewsItemPersistence(this.config);
		try {
			for (const item of news) {
				await newsStorage.saveNews(item, 'news-category');
			}
			console.log('all news-items saved!!');
		} catch (err) {
			console.error('News Items could not be save', err);
			// this.app.getLogger().error('News Items could not be save', err);
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
		const techCrunchNewsSource = new NewsSource(techCrunchAdapter);

		try {
			// await techCrunchNewsSource.deleteNews(read, modify, room, http, persis);
			console.log('all news deleted!');
		} catch (err) {
			console.error(err);
		}
	}
}
