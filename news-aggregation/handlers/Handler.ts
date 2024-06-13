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

export class Handler implements IHandler {
	public app: NewsAggregationApp;
	public room: IRoom;
	public sender: IUser;
	public read: IRead;
	public modify: IModify;
	public http: IHttp;
	public persis: IPersistence;
	public triggerId?: string;

	constructor(params: IHandlerParams) {
		this.app = params.app;
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

		// const modal = await subscribeNewsModal(
		// 	this.app,
		// 	this.room,
		// 	this.sender,
		// 	this.read,
		// 	this.modify,
		// 	this.http,
		// 	this.persis
		// );

		// if (modal instanceof Error) {
		// 	// Something went Wrong, maybe the elements Couldn't be built
		// 	this.app.getLogger().error(modal.message);
		// 	return;
		// }

		// if (this.triggerId) {
		// 	await this.modify
		// 		.getUiController()
		// 		.openSurfaceView(modal, { triggerId: this.triggerId }, this.sender);
		// }
	}

	public async unsubscribeNews(): Promise<void> {
		console.log('news unsubscribe working.');
		this.app.getLogger().info('news unsubscribe working.');
	}
}