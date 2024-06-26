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

		try {
			switch (actionId) {
				case 'subscribe-action-id':
			}
			return this.context.getInteractionResponder().successResponse();
		} catch (err) {
			console.error(err);
			this.app.getLogger().error(err);
			return this.context.getInteractionResponder().errorResponse();
		}
	}
}
