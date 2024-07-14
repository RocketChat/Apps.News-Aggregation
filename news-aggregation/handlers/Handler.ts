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
		console.log('triggId:', this.triggerId);

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
	}
}
