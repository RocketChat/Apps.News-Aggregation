import {
	IPersistence,
	IPersistenceRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { NewsAggregationApp } from '../../NewsAggregationApp';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import {
	RocketChatAssociationModel,
	RocketChatAssociationRecord,
} from '@rocket.chat/apps-engine/definition/metadata';
import { ISubscription } from '../../definitions/ISubscription';

/**
 * Manages persistence operations related to news subscriptions.
 */
export class SubscriptionPersistence {
	persistenceRead: IPersistenceRead;
	persistence: IPersistence;

	/**
	 * Constructor for SubscriptionPersistence.
	 * @param persistenceRead - The persistence interface for reading data.
	 * @param persistence - The persistence interface for writing data.
	 */
	constructor(persistenceRead: IPersistenceRead, persistence: IPersistence) {
		this.persistenceRead = persistenceRead;
		this.persistence = persistence;
	}

	/**
	 * Creates a new subscription for a user and room with specified interval and categories.
	 * @param interval - The interval for the subscription (e.g., daily, weekly).
	 * @param categories - The categories of news to subscribe to.
	 * @param user - The user subscribing to the news.
	 * @param room - The room where the news will be posted.
	 * @returns The ID of the created subscription or null if creation failed.
	 */
	public async createSubscription(
		interval: string,
		categories: string[],
		user: IUser,
		room: IRoom
	) {
		console.log('started saving subs');

		const associations: Array<RocketChatAssociationRecord> = [
			new RocketChatAssociationRecord(
				RocketChatAssociationModel.MISC,
				'news-aggregation-subscription'
			),
			new RocketChatAssociationRecord(
				RocketChatAssociationModel.MISC,
				interval
			),
			new RocketChatAssociationRecord(RocketChatAssociationModel.USER, user.id),
			new RocketChatAssociationRecord(RocketChatAssociationModel.ROOM, room.id),
		];

		const subscriptions = await this.getSubscription(interval, room);
		if (subscriptions.length !== 0) {
			console.log('News subscription already exists');
			// this.app.getLogger().info('News subscription already exists');
			return;
		}

		let subscriptionRecord: ISubscription = {
			userId: user.id,
			roomId: room.id,
			interval: interval,
			categories: categories,
			createdOn: new Date(),
		};

		let subscriptionId: any;
		try {
			subscriptionId = await this.persistence.createWithAssociations(
				subscriptionRecord,
				associations
			);
			console.log('subscription created!!', subscriptionId);
		} catch (err) {
			subscriptionId = null;
			console.error('Could not create news subscription', err);
			// this.app.getLogger().info('Could not create news subscription', err);
		}

		console.log('saved subs');
		return subscriptionId;
	}

	// public async getSubscribedRooms(room: IRoom): Promise<Array<ISubscription>> {
	// 	const associations: Array<RocketChatAssociationRecord> = [
	// 		new RocketChatAssociationRecord(
	// 			RocketChatAssociationModel.MISC,
	// 			'news-aggregation-subscription'
	// 		),
	// 		new RocketChatAssociationRecord(RocketChatAssociationModel.ROOM, room.id),
	// 	];

	// 	let subscriptions: Array<ISubscription>;
	// 	try {
	// 		subscriptions = (await this.persistenceRead.readByAssociations(
	// 			associations
	// 		)) as Array<ISubscription>;
	// 	} catch (err) {
	// 		subscriptions = [];
	// 		console.error('Could not get subscribed rooms', err);
	// 		this.app.getLogger().info('Could not get subscribed rooms', err);
	// 	}

	// 	return subscriptions;
	// }

	// public async getSubscribedRooms(subscription: ISubscription): Promise<Array<ISubscription>> {
	// 	const associations: Array<RocketChatAssociationRecord> = [
	// 		new RocketChatAssociationRecord(
	// 			RocketChatAssociationModel.MISC,
	// 			'news-aggregation-subscription'
	// 		),
	// 		new RocketChatAssociationRecord(RocketChatAssociationModel.ROOM, subscription.id),
	// 	];

	// 	let subscriptions: Array<ISubscription>;
	// 	try {
	// 		subscriptions = (await this.persistenceRead.readByAssociations(
	// 			associations
	// 		)) as Array<ISubscription>;
	// 	} catch (err) {
	// 		subscriptions = [];
	// 		console.error('Could not get subscribed rooms', err);
	// 		this.app.getLogger().info('Could not get subscribed rooms', err);
	// 	}

	// 	return subscriptions;
	// }

	/**
	 * Retrieves all subscriptions.
	 * @returns A list of all subscriptions.
	 */
	public async getSubscriptions(): Promise<Array<ISubscription>> {
		const associations: Array<RocketChatAssociationRecord> = [
			new RocketChatAssociationRecord(
				RocketChatAssociationModel.MISC,
				'news-aggregation-subscription'
			),
		];

		let subscriptions: Array<ISubscription>;
		try {
			subscriptions = (await this.persistenceRead.readByAssociations(
				associations
			)) as Array<ISubscription>;
		} catch (err) {
			subscriptions = [];
			console.error('Could not get subscriptions', err);
			// this.app.getLogger().info('Could not get subscriptions', err);
		}

		return subscriptions;
	}

	/**
	 * Retrieves a subscription by its ID.
	 * @param subscriptionId - The ID of the subscription to retrieve.
	 * @returns The subscription with the given ID or an empty array if not found.
	 */
	public async getSubscriptionById(
		subscriptionId: string
	): Promise<Array<ISubscription>> {
		const associations: Array<RocketChatAssociationRecord> = [
			new RocketChatAssociationRecord(
				RocketChatAssociationModel.MISC,
				'news-aggregation-subscription'
			),
			new RocketChatAssociationRecord(
				RocketChatAssociationModel.MISC,
				subscriptionId
			),
		];

		let subscriptions: Array<ISubscription>;
		try {
			subscriptions = (await this.persistenceRead.readByAssociations(
				associations
			)) as Array<ISubscription>;
		} catch (err) {
			subscriptions = [];
			console.error('Could not get subscriptions', err);
			// this.app.getLogger().info('Could not get subscriptions', err);
		}

		return subscriptions;
	}

	/**
	 * Retrieves subscriptions by the interval.
	 * @param interval - The interval to filter subscriptions by.
	 * @returns A list of subscriptions matching the interval.
	 */
	public async getSubscriptionByInterval(
		interval: string
	): Promise<Array<ISubscription>> {
		const associations: Array<RocketChatAssociationRecord> = [
			new RocketChatAssociationRecord(
				RocketChatAssociationModel.MISC,
				'news-aggregation-subscription'
			),
			new RocketChatAssociationRecord(
				RocketChatAssociationModel.MISC,
				interval
			),
		];

		let subscriptions: Array<ISubscription>;
		try {
			subscriptions = (await this.persistenceRead.readByAssociations(
				associations
			)) as Array<ISubscription>;
		} catch (err) {
			subscriptions = [];
			console.error('Could not get subscriptions', err);
			// this.app.getLogger().info('Could not get subscriptions', err);
		}

		return subscriptions;
	}

	/**
	 * Retrieves a subscription by room.
	 * @param room - The room to filter subscriptions by.
	 * @returns The subscription associated with the room or a default empty subscription.
	 */
	public async getSubscriptionByRoom(room: IRoom): Promise<ISubscription> {
		const associations: Array<RocketChatAssociationRecord> = [
			new RocketChatAssociationRecord(
				RocketChatAssociationModel.MISC,
				'news-aggregation-subscription'
			),
			new RocketChatAssociationRecord(RocketChatAssociationModel.ROOM, room.id),
		];

		let subscription: ISubscription;
		try {
			let result = await this.persistenceRead.readByAssociations(associations);
			subscription = result[0] as ISubscription;
		} catch (err) {
			subscription = { userId: '', roomId: '', interval: '' };
			console.error('Could not get subscription', err);
			// this.app.getLogger().info('Could not get subscription', err);
		}

		return subscription;
	}

	/**
	 * Retrieves subscriptions by interval and room.
	 * @param interval - The interval of the subscription.
	 * @param room - The room associated with the subscription.
	 * @returns A list of subscriptions matching the interval and room.
	 */
	public async getSubscription(
		interval: string,
		room: IRoom
	): Promise<Array<ISubscription>> {
		const associations: Array<RocketChatAssociationRecord> = [
			new RocketChatAssociationRecord(
				RocketChatAssociationModel.MISC,
				'news-aggregation-subscription'
			),
			new RocketChatAssociationRecord(
				RocketChatAssociationModel.MISC,
				interval
			),
			new RocketChatAssociationRecord(RocketChatAssociationModel.ROOM, room.id),
		];

		let subscriptions: Array<ISubscription>;
		try {
			subscriptions = (await this.persistenceRead.readByAssociations(
				associations
			)) as Array<ISubscription>;
		} catch (err) {
			subscriptions = [];
			console.error('Could not get subscriptions', err);
			// this.app.getLogger().info('Could not get subscriptions', err);
		}

		return subscriptions;
	}

	/**
	 * Deletes subscriptions associated with a specific room.
	 * @param room - The room for which subscriptions should be deleted.
	 */
	public async deleteSubscriptionsByRoom(room: IRoom) {
		const associations: Array<RocketChatAssociationRecord> = [
			new RocketChatAssociationRecord(
				RocketChatAssociationModel.MISC,
				'news-aggregation-subscription'
			),
			new RocketChatAssociationRecord(RocketChatAssociationModel.ROOM, room.id),
		];

		try {
			await this.persistence.removeByAssociations(associations);
		} catch (err) {
			console.error('Could not delete subscriptions by room', err);
			// this.app.getLogger().info('Could not delete subscriptions by room', err);
		}
	}

	/**
	 * Deletes subscriptions associated with a specific user.
	 * @param user - The user for whom subscriptions should be deleted.
	 */
	public async deleteSubscriptionsByUser(user: IUser) {
		const associations: Array<RocketChatAssociationRecord> = [
			new RocketChatAssociationRecord(
				RocketChatAssociationModel.MISC,
				'news-aggregation-subscription'
			),
			new RocketChatAssociationRecord(RocketChatAssociationModel.USER, user.id),
		];

		try {
			await this.persistence.removeByAssociations(associations);
		} catch (err) {
			console.error('Could not delete subscriptions by room', err);
			// this.app.getLogger().info('Could not delete subscriptions by room', err);
		}
	}

	/**
	 * Deletes a subscription by its ID, associated with a specific room and user.
	 * @param subscriptionId - The ID of the subscription to delete.
	 * @param room - The room associated with the subscription.
	 * @param user - The user associated with the subscription.
	 */
	public async deleteSubscriptionById(
		subscriptionId: string,
		room: IRoom,
		user: IUser
	) {
		const associations: Array<RocketChatAssociationRecord> = [
			new RocketChatAssociationRecord(
				RocketChatAssociationModel.MISC,
				'news-aggregation-subscription'
			),
			new RocketChatAssociationRecord(
				RocketChatAssociationModel.MISC,
				subscriptionId
			),
			new RocketChatAssociationRecord(RocketChatAssociationModel.ROOM, room.id),
			new RocketChatAssociationRecord(RocketChatAssociationModel.USER, user.id),
		];

		try {
			await this.persistence.removeByAssociations(associations);
		} catch (err) {
			console.error('Could not delete subscription by id', err);
			// this.app.getLogger().info('Could not delete subscription by id', err);
		}
	}

	/**
	 * Deletes a subscription for a specific user and room.
	 * @param user - The user associated with the subscription.
	 * @param room - The room associated with the subscription.
	 */
	public async deleteSubscription(user: IUser, room: IRoom) {
		const associations: Array<RocketChatAssociationRecord> = [
			new RocketChatAssociationRecord(
				RocketChatAssociationModel.MISC,
				'news-aggregation-subscription'
			),
			// new RocketChatAssociationRecord(
			// 	RocketChatAssociationModel.USER,
			// 	interval
			// ),
			new RocketChatAssociationRecord(RocketChatAssociationModel.USER, user.id),
			new RocketChatAssociationRecord(RocketChatAssociationModel.USER, room.id),
		];

		try {
			await this.persistence.removeByAssociations(associations);
		} catch (err) {
			console.error('Could not delete subscriptions by room', err);
			// this.app.getLogger().info('Could not delete subscriptions by room', err);
		}
	}

	/**
	 * Deletes subscriptions by interval and room.
	 * @param interval - The interval of the subscription.
	 * @param room - The room associated with the subscription.
	 */
	public async deleteSubscriptionByIntervalAndRoom(
		interval: string,
		room: IRoom
	) {
		const associations: Array<RocketChatAssociationRecord> = [
			new RocketChatAssociationRecord(
				RocketChatAssociationModel.MISC,
				'news-aggregation-subscription'
			),
			new RocketChatAssociationRecord(
				RocketChatAssociationModel.MISC,
				interval
			),
			new RocketChatAssociationRecord(RocketChatAssociationModel.ROOM, room.id),
		];

		try {
			await this.persistence.removeByAssociations(associations);
			console.log('DEL');
		} catch (err) {
			console.error('Could not delete subscriptions by room', err);
			// this.app.getLogger().info('Could not delete subscriptions by room', err);
		}
	}

	/**
	 * Checks if a room has any subscriptions.
	 * @param room - The room to check for subscriptions.
	 * @returns True if there are subscriptions, otherwise false.
	 */
	public async isSubscribed(room: IRoom) {
		const associations: Array<RocketChatAssociationRecord> = [
			new RocketChatAssociationRecord(
				RocketChatAssociationModel.MISC,
				'news-aggregation-subscription'
			),
			new RocketChatAssociationRecord(RocketChatAssociationModel.ROOM, room.id),
		];

		const [subscriptions] =
			await this.persistenceRead.readByAssociations(associations);
		return !!subscriptions;
	}
}
