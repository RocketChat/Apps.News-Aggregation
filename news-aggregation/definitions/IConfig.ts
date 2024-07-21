import {
	IModify,
	IPersistence,
	IRead,
} from '@rocket.chat/apps-engine/definition/accessors';

export interface IConfig {
	read: IRead;
	modify: IModify;
	persistence: IPersistence;
}
