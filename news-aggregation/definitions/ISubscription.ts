import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';

/**
 * Interface representing a subscription to news updates.
 * It includes information about the user, room, and subscription details.
 */
export interface ISubscription {
	userId: string;
	roomId: string;
	interval: string;
	categories?: string[];
	createdOn?: Date;
}
