import {
	IPersistence,
	IPersistenceRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import {
	RocketChatAssociationModel,
	RocketChatAssociationRecord,
} from '@rocket.chat/apps-engine/definition/metadata';

export class RoomPersistence {
	private userId: string;
	persistence: IPersistence;
	persistenceRead: IPersistenceRead;

	constructor(
		userId: string,
		persistence: IPersistence,
		persistenceRead: IPersistenceRead
	) {
		this.userId = userId;
		this.persistence = persistence;
		this.persistenceRead = persistenceRead;
	}

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

	public async getInteractionRoomId(): Promise<string> {
		const association = new RocketChatAssociationRecord(
			RocketChatAssociationModel.USER,
			`${this.userId}#RoomId`
		);
		const [result] = (await this.persistenceRead.readByAssociation(
			association
		)) as Array<{ roomId: string }>;
		return result.roomId;
	}

	public async clearInteractionRoomId(): Promise<void> {
		const association = new RocketChatAssociationRecord(
			RocketChatAssociationModel.USER,
			`${this.userId}#RoomId`
		);
		await this.persistence.removeByAssociation(association);
	}
}
