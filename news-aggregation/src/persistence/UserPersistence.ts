import {
	IPersistence,
	IPersistenceRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import {
	RocketChatAssociationModel,
	RocketChatAssociationRecord,
} from '@rocket.chat/apps-engine/definition/metadata';

/**
 * Manages persistence operations related to a single user ID.
 */
export class UserPersistence {
	/**
	 * Constructor for UserPersistence.
	 * @param persistence - The persistence interface for writing data.
	 * @param persistenceRead - The persistence interface for reading data.
	 */
	constructor(
		private readonly persistence: IPersistence,
		private readonly persistenceRead: IPersistenceRead
	) {}

	/**
	 * Stores a user ID in the persistence layer.
	 * @param userId - The user ID to be stored.
	 */
	public async storeUserId(userId: string) {
		const association = new RocketChatAssociationRecord(
			RocketChatAssociationModel.USER,
			'news-app-user-id'
		);
		await this.persistence.updateByAssociation(
			association,
			{ userId: userId },
			true
		);
	}

	/**
	 * Retrieves the stored user ID from the persistence layer.
	 * @returns The stored user ID.
	 */
	public async getUserId(): Promise<string> {
		const association = new RocketChatAssociationRecord(
			RocketChatAssociationModel.USER,
			'news-app-user-id'
		);
		const [result] = (await this.persistenceRead.readByAssociation(
			association
		)) as Array<{ userId: string }>;
		return result.userId;
	}
}
