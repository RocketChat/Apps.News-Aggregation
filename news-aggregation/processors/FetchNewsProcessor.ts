import {
	IRead,
	IModify,
	IHttp,
	IPersistence,
} from '@rocket.chat/apps-engine/definition/accessors';
import {
	IJobContext,
	IOnetimeStartup,
	IProcessor,
	IRecurringStartup,
	StartupType,
} from '@rocket.chat/apps-engine/definition/scheduler';
import { NewsItemPersistence } from '../persistence/NewsItemPersistence';
import { NewsAggregationApp } from '../NewsAggregationApp';
import { TechCrunchAdapter } from '../adapters/source-adapters/TechCrunchAdapter';
import { BBCAdapter } from '../adapters/source-adapters/BBCAdapter';
import { NewsSource } from '../definitions/NewsSource';
import { NewsItem } from '../definitions/NewsItem';
import { SettingEnum } from '../enums/settingEnum';
import { ESPNAdapter } from '../adapters/source-adapters/ESPNAdapter';
import { IConfig } from '../definitions/IConfig';
import { RoomPersistence } from '../persistence/RoomPersistence';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { UserPersistence } from '../persistence/UserPersistence';

export class FetchNewsProcessor implements IProcessor {
	id: string = 'fetch-news';

	constructor() {}

	public async processor(
		jobContext: IJobContext,
		read: IRead,
		modify: IModify,
		http: IHttp,
		persis: IPersistence
	): Promise<void> {
		let techCrunchNews: NewsItem[] = [];
		let bbcNews: NewsItem[] = [];
		let espnNews: NewsItem[] = [];

		const userStorage = new UserPersistence(
			persis,
			read.getPersistenceReader()
		);
		const userId = await userStorage.getUserId();
		console.log('userFId: ', userId);

		if (!userId) {
			console.error('No user ID found in job context');
			return;
		}

		const currentUser = (await read.getUserReader().getById(userId)) as IUser;
		if (!currentUser) {
			console.error('User not found');
			return;
		}
		const dm = await read
			.getRoomReader()
			.getDirectByUsernames([currentUser.username]);

		const settingsReader = read.getEnvironmentReader().getSettings();
		const techCrunchSetting = await settingsReader.getById(
			SettingEnum.TECHCRUNCH
		);
		const bbcSetting = await settingsReader.getById(SettingEnum.BBC);
		const espnSetting = await settingsReader.getById(SettingEnum.ESPN);

		// Fetch news items from sources
		if (techCrunchSetting.value) {
			const techCrunchAdapter = new TechCrunchAdapter();
			console.log('hello');
			console.log(this);
			const techCrunchNewsSource = new NewsSource(techCrunchAdapter);
			techCrunchNews = [
				...techCrunchNews,
				...(await techCrunchNewsSource.fetchNews(read, modify, http, persis)),
			];
			console.log('fetch-processor-working2');

			// To implement in next PR
			// const categoryMapping = await techCrunchNewsSource.determineCategory(
			// 	bbcNews,
			// 	read,
			// 	dm,
			// 	currentUser,
			// 	modify,
			// 	http
			// );
			// console.log('tcCATS:', categoryMapping);

			// const parsedMapping = JSON.parse(categoryMapping);

			// for (const news of techCrunchNews) {
			// 	for (const mapping of parsedMapping) {
			// 		if (news.id == Object.keys(mapping)[0]) {
			// 			const key = Object.keys(mapping)[0];
			// 			news.category = mapping[key];
			// 			console.log('category assigned');
			// 		}
			// 	}
			// }
		}

		if (bbcSetting.value) {
			console.log('bbc enabled');

			const bbcAdapter = new BBCAdapter();

			const bbcNewsSource = new NewsSource(bbcAdapter);
			console.log('fetch-processor-working2.1');
			bbcNews = [
				...bbcNews,
				...(await bbcNewsSource.fetchNews(read, modify, http, persis)),
			];
			console.log('bcbcNEws', bbcNews);

			const categoryMapping = await bbcNewsSource.determineCategory(
				bbcNews,
				read,
				dm,
				currentUser,
				modify,
				http
			);

			const parsedMapping = JSON.parse(categoryMapping);

			for (const news of bbcNews) {
				for (const mapping of parsedMapping) {
					if (news.id == Object.keys(mapping)[0]) {
						const key = Object.keys(mapping)[0];
						news.category = mapping[key];
						console.log('category assigned');
					}
				}
			}
		}

		if (espnSetting.packageValue) {
			console.log('espn enabled');
			const espnAdapter = new ESPNAdapter();
			const espnNewsSource = new NewsSource(espnAdapter);
			espnNews = [
				...espnNews,
				...(await espnNewsSource.fetchNews(read, modify, http, persis)),
			];

			// const categoryMapping = await espnNewsSource.determineCategory(
			// 	bbcNews,
			// 	read,
			// 	dm,
			// 	currentUser,
			// 	modify,
			// 	http
			// );

			// const parsedMapping = JSON.parse(categoryMapping);

			// for (const news of espnNews) {
			// 	for (const mapping of parsedMapping) {
			// 		if (news.id == Object.keys(mapping)[0]) {
			// 			const key = Object.keys(mapping)[0];
			// 			news.category = mapping[key];
			// 			console.log('category assigned');
			// 		}
			// 	}
			// }
		}

		const newsStorage = new NewsItemPersistence({
			read: read,
			modify: modify,
			persistence: persis,
		});
		try {
			const saveTechCrunchNews = techCrunchNews.map((newsItem) => {
				if (newsItem.category) {
					newsStorage.saveNews(newsItem, newsItem.category);
				}
			});
			const saveBBCNews = bbcNews.map((newsItem) => {
				if (newsItem.category) {
					newsStorage.saveNews(newsItem, newsItem.category);
				}
			});
			const saveESPNNews = espnNews.map((newsItem) =>
				newsStorage.saveNews(newsItem, 'Sports')
			);
			await Promise.all([saveTechCrunchNews, saveBBCNews, saveESPNNews]);
			console.log('all news-items saved!!');
		} catch (err) {
			console.error('News Items could not be save', err);
			// this.app.getLogger().error('News Items could not be save', err);
		}

		console.log('FetchNewsProcessor completed.');
	}
}
