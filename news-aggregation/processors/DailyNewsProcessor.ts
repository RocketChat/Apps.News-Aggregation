import {
	IJobContext,
	IProcessor,
} from '@rocket.chat/apps-engine/definition/scheduler';
import { NewsAggregationApp } from '../NewsAggregationApp';
import {
	IRead,
	IModify,
	IHttp,
	IPersistence,
} from '@rocket.chat/apps-engine/definition/accessors';
import { NewsItem } from '../definitions/NewsItem';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { NewsItemPersistence } from '../persistence/NewsItemPersistence';
import { buildNewsBlock } from '../blocks/UtilityBlocks';
import { sendMessage } from '../utils/message';
import { Block } from '@rocket.chat/ui-kit';
import { SubscriptionPersistence } from '../persistence/SubscriptionPersistence';
import { RoomPersistence } from '../persistence/RoomPersistence';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { ISubscription } from '../definitions/ISubscription';

export class DailyNewsProcessor implements IProcessor {
	id: string = 'daily-news';
	app: NewsAggregationApp;

	constructor(app: NewsAggregationApp) {
		this.app = app;
	}

	public async processor(
		jobContext: IJobContext,
		read: IRead,
		modify: IModify,
		http: IHttp,
		persis: IPersistence
	): Promise<void> {
		console.log('dailynewsdeliverstarted');

		let news: NewsItem[] = [];
		const appUser = (await read.getUserReader().getAppUser()) as IUser;
		const roomStorage = new RoomPersistence(
			appUser.id,
			persis,
			read.getPersistenceReader()
		);
		console.log('dailynewsdeliverstarted2');

		const roomId = await roomStorage.getSubscriptionRoomId();
		console.log('ROOMIDD:', roomId);

		const room = (await read.getRoomReader().getById(roomId)) as IRoom;

		// const techCrunchAdapter = new TechCrunchAdapter();
		// const techCrunchNewsSource = new NewsSource(
		// 	this.app,
		// 	techCrunchAdapter,
		// 	news
		// );

		const newsStorage = new NewsItemPersistence(
			this.app,
			persis,
			read.getPersistenceReader()
		);

		const subscriptionStorage = new SubscriptionPersistence(
			this.app,
			read.getPersistenceReader(),
			persis
		);
		const allSubscriptions = await subscriptionStorage.getSubscriptions();
		// const subscription = await subscriptionStorage.getSubscriptionByRoom(room);
		// console.log('subs: ', subscription);
		console.log('allSubs: ', allSubscriptions);

		console.log('deliver news working');

		const deliverNews = async (subscription: ISubscription) => {
			if (subscription?.categories) {
				for (const category of subscription?.categories) {
					news = (await newsStorage.getAllSubscribedNews(
						category
					)) as NewsItem[];

					for (const item of news) {
						const newsBlock = await buildNewsBlock(item);
						// newsBlocks.push(newsBlock);
						await sendMessage(modify, room, appUser, '', newsBlock);
					}
				}
			}
		};

		try {
			// news = await techCrunchNewsSource.getNews(
			// 	this.read,
			// 	this.modify,
			// 	this.room,
			// 	this.http,
			// 	this.persistence
			// );
			// news = (await newsStorage.getAllNews()) as NewsItem[];
			// news = (await newsStorage.getAllSubscribedNews(subscription.categories))

			// get only the news of subscribed categories to subscribed rooms
			await Promise.all([
				allSubscriptions?.map((subscription) => deliverNews(subscription)),
			]);
			console.log('fetched!!', news, 'FETCHED FROM PERSISTENCE!');

			// To implement
			let newsBlocks: Array<Array<Block>> = [];
			// for (const item of news) {
			// 	const newsBlock = await buildNewsBlock(item);
			// 	// newsBlocks.push(newsBlock);
			// 	await sendMessage(this.modify, this.room, appUser, '', newsBlock);
			// }

			// await sendNewsMessage(
			// 	this.modify,
			// 	this.room,
			// 	this.sender,
			// 	'',
			// 	newsBlocks
			// );
			console.log('news displayed!');
		} catch (err) {
			this.app.getLogger().error(err);
			console.error(err);
		}
	}
}
