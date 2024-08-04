import {
	IHttp,
	IModify,
	IPersistence,
	IPersistenceRead,
	IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { NewsAggregationApp } from '../NewsAggregationApp';

/**
 * The ICommandUtility interface acts as a contract for the command utility class,
 * defining the properties and methods required for command handling.
 */
export interface ICommandUtility {
	sender: IUser;
	room: IRoom;
	command: string[];
	context: SlashCommandContext;
	read: IRead;
	modify: IModify;
	http: IHttp;
	persistence: IPersistence;
	persistenceRead: IPersistenceRead;
	app: NewsAggregationApp;
	triggerId?: string;

	/**
	 * Resolves the command issued by the user.
	 * @returns A promise that resolves when the command handling is complete.
	 */
	resolveCommand(): Promise<void>;
}

/**
 * The ICommandUtilityParams interface defines the parameters required to create an instance
 * of a class implementing the ICommandUtility interface.
 */
export interface ICommandUtilityParams {
	sender: IUser;
	room: IRoom;
	command: string[];
	context: SlashCommandContext;
	read: IRead;
	modify: IModify;
	http: IHttp;
	persistence: IPersistence;
	persistenceRead: IPersistenceRead;
	app: NewsAggregationApp;
	triggerId?: string;
}
