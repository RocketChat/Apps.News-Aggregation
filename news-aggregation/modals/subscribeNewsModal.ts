import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { NewsAggregationApp } from '../NewsAggregationApp';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import {
	IHttp,
	IModify,
	IPersistence,
	IRead,
	IUIKitSurfaceViewParam,
} from '@rocket.chat/apps-engine/definition/accessors';
import { ModalEnum } from '../enums/modalEnum';
import {
	ButtonStyle,
	UIKitSurfaceType,
} from '@rocket.chat/apps-engine/definition/uikit';
import { Block, TextObjectType } from '@rocket.chat/ui-kit';

export async function subscribeNewsModal(
	app: NewsAggregationApp,
	room: IRoom,
	sender: IUser,
	read: IRead,
	modify: IModify,
	http: IHttp,
	persis: IPersistence
): Promise<IUIKitSurfaceViewParam | Error> {
	const { elementBuilder, blockBuilder } = app.getBuilders();

	const blocks: Block[] = [];
	let text = 'hello';

	const inputElement = elementBuilder.createPlainTextInput(
		{
			text: 'Hello',
			initialValue: 'This is for testing',
			multiline: true,
		},
		{
			blockId: 'input-element-block-id',
			actionId: 'input-element-action-id',
		}
	);

	const inputBlock = blockBuilder.createInputBlock({
		text,
		element: inputElement,
		optional: true,
	});
	blocks.push(inputBlock);

	const dividerBlock = blockBuilder.createDividerBlock('divider-block-id');
	blocks.push(dividerBlock);
	blocks.push(inputBlock);

	const submitButton = elementBuilder.createButton(
		{
			text: ModalEnum.SUBSCRIBE_NEWS_SUBMIT_BUTTON,
			style: ButtonStyle.PRIMARY,
			secondary: false,
		},
		{
			blockId: ModalEnum.SUBSCRIBE_NEWS_MODAL_SUBMIT_BLOCK_ID,
			actionId: ModalEnum.SUBSCRIBE_NEWS_MODAL_SUBMIT_ACTION_ID,
		}
	);

	const closeButton = elementBuilder.createButton(
		{
			text: ModalEnum.SUBSCRIBE_NEWS_CLOSE_BUTTON,
			style: ButtonStyle.DANGER,
			secondary: true,
		},
		{
			blockId: ModalEnum.SUBSCRIBE_NEWS_MODAL_CLOSE_BLOCK_ID,
			actionId: ModalEnum.SUBSCRIBE_NEWS_MODAL_CLOSE_ACTION_ID,
		}
	);

	return {
		id: ModalEnum.SUBSCRIBE_VIEW_ID,
		type: UIKitSurfaceType.MODAL,
		title: {
			type: TextObjectType.PLAIN_TEXT,
			text: ModalEnum.SUBSCRIBE_NEWS_TITLE,
			emoji: true,
		},
		blocks,
		close: closeButton,
		submit: submitButton,
	};
}
