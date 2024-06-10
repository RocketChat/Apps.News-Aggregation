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

export class Handler implements IHandler {
	public app: NewsAggregationApp;
	public room: IRoom;
	public sender: IUser;
	public read: IRead;
	public modify: IModify;
	public http: IHttp;
	public persis: IPersistence;

	constructor(params: IHandlerParams) {
		this.app = params.app;
		this.room = params.room;
		this.sender = params.sender;
		this.read = params.read;
		this.modify = params.modify;
		this.http = params.http;
		this.persis = params.persistence;
	}

	public async subscribeNews(): Promise<void> {}
}
