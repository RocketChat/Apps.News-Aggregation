import {
	IUIKitResponse,
	UIKitBlockInteractionContext,
} from '@rocket.chat/apps-engine/definition/uikit';
import { NewsAggregationApp } from '../NewsAggregationApp';
import {
	IHttp,
	IModify,
	IPersistence,
	IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { SubscriptionPersistence } from '../persistence/SubscriptionPersistence';

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

	// public async handleActions(): Promise<IUIKitResponse> {
	// 	const { actionId, blockId, user, room } = this.context.getInteractionData();
	// 	const subscriptionStorage = new SubscriptionPersistence(
	// 		this.app,
	// 		this.read.getPersistenceReader(),
	// 		this.persistence
	// 	);
	// 	console.log('blockaction');
	// 	console.log('aid', actionId);
	// 	console.log('uid', user);
	// 	console.log('rid', room);

	// 	try {
	// 		switch (actionId) {
	// 			case 'subcribe-news-submit-action-id':
	// 				if (room) {
	// 					await subscriptionStorage.createSubscription(
	// 						'* * * * *',
	// 						user,
	// 						room
	// 					);
	// 				}
	// 		}
	// 		return this.context.getInteractionResponder().successResponse();
	// 	} catch (err) {
	// 		console.error(err);
	// 		this.app.getLogger().error(err);
	// 		return this.context.getInteractionResponder().errorResponse();
	// 	}
	// }
}
