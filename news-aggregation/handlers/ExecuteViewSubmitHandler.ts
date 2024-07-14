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
		const { actionId, user, room } = this.context.getInteractionData();
		const subscriptionStorage = new SubscriptionPersistence(
			this.app,
			this.read.getPersistenceReader(),
			this.persistence
		);

		console.log('viewsubmit');
		console.log('aid', actionId);
		console.log('uid', user);
		console.log('rid', room);

		try {
			switch (actionId) {
				case ModalEnum.SUBSCRIBE_NEWS_MODAL_SUBMIT_ACTION_ID:
					if (room) {
						await subscriptionStorage.createSubscription(
							'* * * * *',
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
