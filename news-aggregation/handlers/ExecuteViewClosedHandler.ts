import {
	IUIKitResponse,
	UIKitViewCloseInteractionContext,
} from '@rocket.chat/apps-engine/definition/uikit';
import { NewsAggregationApp } from '../NewsAggregationApp';
import {
	IHttp,
	IModify,
	IPersistence,
	IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { RoomPersistence } from '../persistence/RoomPersistence';
import { ModalEnum } from '../enums/modalEnum';

export class ExecuteViewClosedHandler {
	private context: UIKitViewCloseInteractionContext;
	constructor(
		private readonly app: NewsAggregationApp,
		private readonly read: IRead,
		private readonly modify: IModify,
		private readonly http: IHttp,
		private readonly persistence: IPersistence,
		context: UIKitViewCloseInteractionContext
	) {
		this.context = context;
	}

	public async handleActions(): Promise<IUIKitResponse> {
		const { view, user, appId } = this.context.getInteractionData();
		console.log('viewClosed: ', this.context.getInteractionData());

		const roomStorage = new RoomPersistence(
			user.id,
			this.persistence,
			this.read.getPersistenceReader()
		);

		try {
			switch (view.id) {
				case ModalEnum.SUBSCRIBE_VIEW_ID:
					await roomStorage.clearInteractionRoomId();
			}
			return this.context.getInteractionResponder().successResponse();
		} catch (err) {
			console.error(err);
			this.app.getLogger().error(err);
			return this.context.getInteractionResponder().errorResponse();
		}
	}
}
