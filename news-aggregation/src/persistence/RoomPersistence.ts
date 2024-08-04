import {
	IPersistence,
	IPersistenceRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import {
	RocketChatAssociationModel,
	RocketChatAssociationRecord,
} from '@rocket.chat/apps-engine/definition/metadata';

/**
 * Manages persistence operations related to subscription rooms for users.
 */
export class RoomPersistence {
	private userId: string;
	persistence: IPersistence;
	persistenceRead: IPersistenceRead;

	/**
	 * Constructor for RoomPersistence.
	 * @param userId - The ID of the user for whom room data is being managed.
	 * @param persistence - The persistence interface for writing data.
	 * @param persistenceRead - The persistence interface for reading data.
	 */
	constructor(
		userId: string,
		persistence: IPersistence,
		persistenceRead: IPersistenceRead
	) {
		this.userId = userId;
		this.persistence = persistence;
		this.persistenceRead = persistenceRead;
	}

	/**
	 * Stores the ID of a subscription room for the user.
	 * @param roomId - The ID of the room to store.
	 */
	public async storeSubscriptionRoomId(roomId: string) {
		const association = new RocketChatAssociationRecord(
			RocketChatAssociationModel.USER,
			`${this.userId}#RoomId`
		);
		await this.persistence.updateByAssociation(
			association,
			{ roomId: roomId },
			true
		);
	}

	/**
	 * Retrieves the stored subscription room ID for the user.
	 * @returns The ID of the stored room.
	 */
	public async getSubscriptionRoomId(): Promise<string> {
		const association = new RocketChatAssociationRecord(
			RocketChatAssociationModel.USER,
			`${this.userId}#RoomId`
		);
		const [result] = (await this.persistenceRead.readByAssociation(
			association
		)) as Array<{ roomId: string }>;
		return result.roomId;
	}

	/**
	 * Clears the stored subscription room ID for the user.
	 */
	public async clearSubscriptionRoomId(): Promise<void> {
		const association = new RocketChatAssociationRecord(
			RocketChatAssociationModel.USER,
			`${this.userId}#RoomId`
		);
		await this.persistence.removeByAssociation(association);
	}
}
