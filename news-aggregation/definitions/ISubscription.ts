import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';

export interface ISubscription {
	userId: string;
	roomId: string;
	interval: string;
	categories?: string[];
	createdOn?: Date;
}
