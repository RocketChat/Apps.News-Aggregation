import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';

export interface ISubscription {
	userId: string;
	interval: string;
	createdOn: Date;
	user: string;
	room: string;
}
