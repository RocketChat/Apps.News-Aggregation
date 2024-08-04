import {
	IModify,
	IPersistence,
	IRead,
} from '@rocket.chat/apps-engine/definition/accessors';

/**
 * Interface representing the configuration object
 * that provides access to Rocket.Chat data and persistence mechanisms.
 */
export interface IConfig {
	read: IRead;
	modify: IModify;
	persistence: IPersistence;
}
