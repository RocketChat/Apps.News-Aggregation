import {
	IHttp,
	IModify,
	IPersistence,
	IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { NewsAggregationApp } from '../NewsAggregationApp';
import { IHandler, IHandlerParams } from '../definitions/IHandler';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
// import { subscribeNewsModal } from '../modals/subscribeNewsModal';
import { SubscriptionPersistence } from '../persistence/SubscriptionPersistence';
import { subscribeNewsModal } from '../modals/subscribeNewsModal';
import { UIKitBlockInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import { SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import {
	sendHelperMessage,
	sendMessage,
	sendNotification,
} from '../utils/message';
import { NewsItem } from '../definitions/NewsItem';
import { NewsItemPersistence } from '../persistence/NewsItemPersistence';
import { shuffleArray } from '../utils/shuffleArray';
import { buildNewsBlock } from '../blocks/UtilityBlocks';
// import { NewsDeliveryService } from '../services/NewsDeliveryService';
// import { getSubscribeBlock } from '../utils/blocks';

export class Handler implements IHandler {
	public app: NewsAggregationApp;
	public context: SlashCommandContext;
	public room: IRoom;
	public sender: IUser;
	public read: IRead;
	public modify: IModify;
	public http: IHttp;
	public persis: IPersistence;
	public triggerId?: string;

	constructor(params: IHandlerParams) {
		this.app = params.app;
		this.context = params.context;
		this.room = params.room;
		this.sender = params.sender;
		this.read = params.read;
		this.modify = params.modify;
		this.http = params.http;
		this.persis = params.persistence;
		this.triggerId = params.triggerId;
	}

	public async subscribeNews(): Promise<void> {
		console.log('news subscribe working.');
		this.app.getLogger().info('news subscribe working.');
		const persisRead = this.read.getPersistenceReader();
		const subscriptionStorage = new SubscriptionPersistence(
			persisRead,
			this.persis
		);

		const isSubscribed = await subscriptionStorage.isSubscribed(this.room);
		if (isSubscribed) {
			const subscribedNotify = `### News Aggregation App
                        *You have already subscribed in this room. Use \`/news unsubscribe\` to unsubscribe.*`;
			return await sendNotification(
				this.read,
				this.modify,
				this.sender,
				this.room,
				subscribedNotify
			);
		}
		// TO-DO
		const modal = await subscribeNewsModal(
			this.app,
			this.room,
			this.sender,
			this.read,
			this.modify,
			this.http,
			this.persis
		);

		// if (modal instanceof Error) {
		// 	// Something went Wrong, maybe the elements Couldn't be built
		// 	this.app.getLogger().error(modal.message);
		// 	return;
		// }
		this.triggerId = this.context.getTriggerId();
		console.log('substriggId:', this.triggerId);

		if (this.triggerId) {
			await this.modify
				.getUiController()
				.openSurfaceView(modal, { triggerId: this.triggerId }, this.sender);
		}

		// const subscribeBlock = await getSubscribeBlock(this.app.getID());
		// const mesageId = await sendMessage(
		// 	this.modify,
		// 	this.room,
		// 	this.sender,
		// 	'Subscribe Button',
		// 	subscribeBlock
		// );

		// const subscriptionPersistence = new SubscriptionPersistence(
		// 	this.app,
		// 	persisRead,
		// 	this.persis
		// );

		// const subscriptionId = await subscriptionPersistence.createSubscription(
		// 	'* * * * *',
		// 	this.sender,
		// 	this.room
		// );
		// console.log('subId', subscriptionId);

		// const deliveryService = new NewsDeliveryService(
		// 	this.app,
		// 	this.persis,
		// 	persisRead
		// );

		// await this.modify
		// 	.getScheduler()
		// 	.scheduleRecurring(await deliveryService.deliverDailyNews());
	}

	public async unsubscribeNews(): Promise<void> {
		console.log('news unsubscribe working.');
		this.app.getLogger().info('news unsubscribe working.');

		this.triggerId = this.context.getTriggerId();
		console.log('triggId:', this.triggerId);

		const subscriptionStorage = new SubscriptionPersistence(
			this.read.getPersistenceReader(),
			this.persis
		);
		if (this.triggerId) {
			// await subscriptionStorage.deleteSubscription(this.sender, this.room);
			await subscriptionStorage.deleteSubscriptionsByRoom(this.room);
			// const id = await subscriptionStorage.createSubscription(
			// 	'daily',
			// 	user,
			// 	room
			// );
			// console.log('unsubId:', id);
			const unsubscribeNotify = `### News Aggregation App
            *News Aggregation App unsubscribed in this room. Use \`/news subscribe\` to subscribe.*`;
			return await sendNotification(
				this.read,
				this.modify,
				this.sender,
				this.room,
				unsubscribeNotify
			);
		} else {
			const unsubscribeNotify = `### News Aggregation App
            *You have not subscribed to News Aggregation App. Use \`/news subscribe\` to subscribe.*`;
			return await sendNotification(
				this.read,
				this.modify,
				this.sender,
				this.room,
				unsubscribeNotify
			);
		}
	}

	public async unsubscribeNewsByInterval(interval: string): Promise<void> {
		console.log('news unsubscribe working by interval.');
		this.app.getLogger().info('news unsubscribe working.');

		this.triggerId = this.context.getTriggerId();
		console.log('triggId:', this.triggerId);

		const subscriptionStorage = new SubscriptionPersistence(
			this.read.getPersistenceReader(),
			this.persis
		);
		if (this.triggerId) {
			await subscriptionStorage.deleteSubscriptionByIntervalAndRoom(
				interval,
				this.room
			);
		}
		console.log('deleted by interval');
	}

	public async getNewsOnDemand(): Promise<void> {
		let news: NewsItem[] = [];
		const appUser = (await this.read.getUserReader().getAppUser()) as IUser;

		const newsStorage = new NewsItemPersistence({
			read: this.read,
			modify: this.modify,
			persistence: this.persis,
		});

		const subscriptionStorage = new SubscriptionPersistence(
			this.read.getPersistenceReader(),
			this.persis
		);
		const subscription = await subscriptionStorage.getSubscriptionByRoom(
			this.room
		);

		if (!subscription) {
			const subscriptionText = `### News Aggregation App
            *The app is not subscribed in this room. Please subscribe to the news you want through the command \`/news subscribe\`*`;
			return await sendNotification(
				this.read,
				this.modify,
				this.sender,
				this.room,
				subscriptionText
			);
		}
		console.log('subs: ', subscription);

		try {
			// get only the news of subscribed categories
			console.log('subsFetch: ', subscription);

			let allSubscribedNews: NewsItem[] = [];
			const room = (await this.read
				.getRoomReader()
				.getById(subscription?.roomId)) as IRoom;

			if (subscription?.categories) {
				if (
					subscription?.categories?.length === 1 &&
					subscription?.categories[0] === 'All Categories'
				) {
					allSubscribedNews = (await newsStorage.getAllNews()) as NewsItem[];
				} else {
					for (const category of subscription?.categories) {
						news = (await newsStorage.getAllSubscribedNews(
							category
						)) as NewsItem[];

						news = news.slice(0, 10);
						allSubscribedNews = [...allSubscribedNews, ...news];
					}
				}
			}

			allSubscribedNews = shuffleArray(allSubscribedNews);

			for (const item of allSubscribedNews.slice(0, 10)) {
				const newsBlock = await buildNewsBlock(item);
				// newsBlocks.push(newsBlock);
				await sendMessage(this.modify, room, appUser, '', newsBlock);
			}
			console.log('fetched!!', news, 'FETCHED FROM PERSISTENCE!');

			console.log('news displayed!');
		} catch (err) {
			this.app.getLogger().error(err);
			console.error(err);
		}
	}

	public async helperMessage(): Promise<void> {
		await sendHelperMessage(
			this.room,
			this.read,
			this.modify,
			this.sender,
			this.http,
			this.persis
		);
	}
}
