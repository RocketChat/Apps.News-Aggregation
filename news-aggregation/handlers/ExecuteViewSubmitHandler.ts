import {
	IUIKitResponse,
	UIKitViewSubmitInteractionContext,
} from '@rocket.chat/apps-engine/definition/uikit';
import { NewsAggregationApp } from '../NewsAggregationApp';
import {
	IHttp,
	IModify,
	IPersistence,
	IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { SubscriptionPersistence } from '../persistence/SubscriptionPersistence';
import { ModalEnum } from '../enums/modalEnum';
import { RoomPersistence } from '../persistence/RoomPersistence';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { sendNotification } from '../utils/message';

export class ExecuteViewSubmitHandler {
	private context: UIKitViewSubmitInteractionContext;
	constructor(
		private readonly app: NewsAggregationApp,
		private readonly read: IRead,
		private readonly modify: IModify,
		private readonly http: IHttp,
		private readonly persistence: IPersistence,
		context: UIKitViewSubmitInteractionContext
	) {
		this.context = context;
	}

	public async handleActions(): Promise<IUIKitResponse> {
		const { actionId, user, view } = this.context.getInteractionData();
		console.log('contextView: ', this.context.getInteractionData());

		const subscriptionStorage = new SubscriptionPersistence(
			this.read.getPersistenceReader(),
			this.persistence
		);

		const roomStorage = new RoomPersistence(
			user?.id,
			this.persistence,
			this.read.getPersistenceReader()
		);
		const roomId = await roomStorage.getSubscriptionRoomId();
		const room = (await this.read.getRoomReader().getById(roomId)) as IRoom;
		let schedule =
			view.state?.['schedule-dropdown-block-id']?.[
				'schedule-dropdown-action-id'
			];

		let categories =
			view.state?.['category-dropdown-block-id']?.[
				'category-dropdown-action-id'
			];

		// Applying these two below functions to store array in a proper format because of Ui-Kit bug.
		function flattenArray(arr: []) {
			return arr.reduce(
				(acc, val) =>
					Array.isArray(val) ? acc.concat(flattenArray(val)) : acc.concat(val),
				[]
			);
		}
		function getUniqueCategories(arr: []) {
			return [...new Set(arr)];
		}
		categories = flattenArray(categories);
		categories = getUniqueCategories(categories);

		console.log('viewsubmit');
		console.log('aid', actionId);
		console.log('uid', user);
		console.log('ridView', room);
		console.log('vid', view.state);
		console.log(
			'scheduleView: ',
			view.state?.['schedule-dropdown-block-id']?.[
				'schedule-dropdown-action-id'
			]
		);
		console.log(
			'categoriesView: ',
			view.state?.['category-dropdown-block-id']?.[
				'category-dropdown-action-id'
			]
		);
		console.log('flatArr: ', categories);

		try {
			console.log('try working');
			switch (view?.id) {
				// View Submit not working.
				case ModalEnum.SUBSCRIBE_VIEW_ID:
					console.log('switch working');

					if (room) {
						console.log('room present hai');

						// add temp default values as params - TO CHANGE
						await subscriptionStorage.createSubscription(
							schedule,
							categories,
							user,
							room
						);

						const subscribedNotify = `### News Aggregation App
                        *Subscribed to News Aggregation App*`;
						await sendNotification(
							this.read,
							this.modify,
							user,
							room,
							subscribedNotify
						);
					}
			}
			return this.context.getInteractionResponder().successResponse();
		} catch (err) {
			console.error(err);
			this.app.getLogger().error(err);
			return this.context.getInteractionResponder().errorResponse();
		}
	}
}
