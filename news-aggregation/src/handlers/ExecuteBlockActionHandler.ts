import {
	IUIKitResponse,
	UIKitBlockInteractionContext,
} from '@rocket.chat/apps-engine/definition/uikit';
import { NewsAggregationApp } from '../../NewsAggregationApp';
import {
	IHttp,
	IModify,
	IPersistence,
	IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { SubscriptionPersistence } from '../persistence/SubscriptionPersistence';
import { ModalEnum } from '../../enums/modalEnum';

export class ExecuteBlockActionHandler {
	private context: UIKitBlockInteractionContext;
	constructor(
		private readonly app: NewsAggregationApp,
		private readonly read: IRead,
		private readonly modify: IModify,
		private readonly http: IHttp,
		private readonly persistence: IPersistence,
		context: UIKitBlockInteractionContext
	) {
		this.context = context;
	}

	public async handleActions(): Promise<IUIKitResponse> {
		const { actionId, blockId, user, room } = this.context.getInteractionData();
		console.log('blockacinteract: ', this.context.getInteractionData());

		const subscriptionStorage = new SubscriptionPersistence(
			this.read.getPersistenceReader(),
			this.persistence
		);
		console.log('blockaction');
		console.log('aid', actionId);
		console.log('uid', user);
		console.log('rid', room);

		try {
			console.log('try working2');

			switch (actionId) {
				case ModalEnum.SUBSCRIBE_NEWS_MODAL_SUBMIT_ACTION_ID:
					console.log('switch working2');

					if (room) {
						console.log('room present');

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
