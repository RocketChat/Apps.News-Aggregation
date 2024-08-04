import {
	IPersistence,
	IPersistenceRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import {
	RocketChatAssociationModel,
	RocketChatAssociationRecord,
} from '@rocket.chat/apps-engine/definition/metadata';

export class UserPersistence {
	constructor(
		private readonly persistence: IPersistence,
		private readonly persistenceRead: IPersistenceRead
	) {}

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
