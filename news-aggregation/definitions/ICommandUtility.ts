import {
	IHttp,
	IModify,
	IPersistence,
	IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { NewsAggregationApp } from '../NewsAggregationApp';

export interface ICommandUtility {
	sender: IUser;
	room: IRoom;
	command: string[];
	context: SlashCommandContext;
	read: IRead;
	modify: IModify;
	http: IHttp;
	persistence: IPersistence;
	app: NewsAggregationApp;

	resolveCommand(): Promise<void>;
}

export interface ICommandUtilityParams {
	sender: IUser;
	room: IRoom;
	command: string[];
	context: SlashCommandContext;
	read: IRead;
	modify: IModify;
	http: IHttp;
	persistence: IPersistence;
	app: NewsAggregationApp;
}
