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
			this.app,
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

		console.log('viewsubmit');
		console.log('aid', actionId);
		console.log('uid', user);
		console.log('ridView', room);
		console.log('vid', view);

		try {
			console.log('try working');
			switch (view?.id) {
				// View Submit not working.
				case ModalEnum.SUBSCRIBE_VIEW_ID:
					console.log('switch working');

					if (room) {
						// add temp default values as params - TO CHANGE
						await subscriptionStorage.createSubscription(
							'daily',
							[],
							user,
							room
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
