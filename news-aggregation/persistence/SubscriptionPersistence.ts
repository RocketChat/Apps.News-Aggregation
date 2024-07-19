import {
	IPersistence,
	IPersistenceRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { NewsAggregationApp } from '../NewsAggregationApp';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import {
	RocketChatAssociationModel,
	RocketChatAssociationRecord,
} from '@rocket.chat/apps-engine/definition/metadata';
import { ISubscription } from '../definitions/ISubscription';

export class SubscriptionPersistence {
	app: NewsAggregationApp;
	persistenceRead: IPersistenceRead;
	persistence: IPersistence;

	constructor(
		app: NewsAggregationApp,
		persistenceRead: IPersistenceRead,
		persistence: IPersistence
	) {
		this.app = app;
		this.persistenceRead = persistenceRead;
		this.persistence = persistence;
	}

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
			this.app.getLogger().info('News subscription already exists');
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
			this.app.getLogger().info('Could not create news subscription', err);
		}

		console.log('saved subs');
		return subscriptionId;
	}

	public async getSubscribedRooms(room: IRoom): Promise<Array<ISubscription>> {
		const associations: Array<RocketChatAssociationRecord> = [
			new RocketChatAssociationRecord(
				RocketChatAssociationModel.MISC,
				'news-aggregation-subscription'
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
			console.error('Could not get subscribed rooms', err);
			this.app.getLogger().info('Could not get subscribed rooms', err);
		}

		return subscriptions;
	}

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
			this.app.getLogger().info('Could not get subscriptions', err);
		}

		return subscriptions;
	}

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
			this.app.getLogger().info('Could not get subscriptions', err);
		}

		return subscriptions;
	}

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
			this.app.getLogger().info('Could not get subscriptions', err);
		}

		return subscriptions;
	}

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
			this.app.getLogger().info('Could not get subscription', err);
		}

		return subscription;
	}

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
			this.app.getLogger().info('Could not get subscriptions', err);
		}

		return subscriptions;
	}

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
			this.app.getLogger().info('Could not delete subscriptions by room', err);
		}
	}

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
			this.app.getLogger().info('Could not delete subscriptions by room', err);
		}
	}

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
			this.app.getLogger().info('Could not delete subscription by id', err);
		}
	}

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
			this.app.getLogger().info('Could not delete subscriptions by room', err);
		}
	}

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
			this.app.getLogger().info('Could not delete subscriptions by room', err);
		}
	}

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
