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
import { ElementBuilder } from '../builders/ElementBuilder';
import { BlockBuilder } from '../builders/BlockBuilder';

export async function subscribeNewsModal(
	app: NewsAggregationApp,
	room: IRoom,
	sender: IUser,
	read: IRead,
	modify: IModify,
	http: IHttp,
	persis: IPersistence
): Promise<IUIKitSurfaceViewParam> {
	// const { elementBuilder, blockBuilder } = app.getBuilders();
	const elementBuilder: ElementBuilder = new ElementBuilder(app.getID());
	const blockBuilder: BlockBuilder = new BlockBuilder(app.getID());

	const blocks: Block[] = [];
	// let text = 'hello';

	// const inputElement = elementBuilder.createPlainTextInput(
	// 	{
	// 		text,
	// 		initialValue: 'This is for testing',
	// 		multiline: true,
	// 	},
	// 	{
	// 		blockId: 'input-element-block-id',
	// 		actionId: 'input-element-action-id',
	// 	}
	// );

	// const inputBlock = blockBuilder.createInputBlock({
	// 	text,
	// 	element: inputElement,
	// 	optional: true,
	// });
	// blocks.push(inputBlock);

	const dividerBlock = blockBuilder.createDividerBlock('divider-block-id');
	blocks.push(dividerBlock);
	// blocks.push(inputBlock);
	// blocks.push(dividerBlock);

	let scheduleOptions: any = ['daily', 'weekly', 'twice-a-week', 'monthly'];
	scheduleOptions = scheduleOptions?.map((option) => ({
		text: option,
		value: option,
	}));
	console.log(scheduleOptions);

	const options1 = elementBuilder.createDropdownOptions(scheduleOptions);
	const schedulerDropdown = elementBuilder.createDropdown(
		{
			options: options1,
			placeholder: 'Select schedule',
		},
		{
			blockId: 'schedule-dropdown-block-id',
			actionId: 'schedule-dropdown-action-id',
		}
	);
	const dropDownBlock = blockBuilder.createSectionBlock({
		text: 'Schedule News',
		accessory: schedulerDropdown,
		blockId: 'dropdown-block-id',
	});
	blocks.push(dropDownBlock);
	blocks.push(dividerBlock);

	let categoryOptions: any = [
		'All Categories',
		'General News',
		'Business and Finance',
		'Technology',
		'Entertainment and Celebrity News',
		'Sports',
		'Science and Environment',
		'Politics',
		'Health',
		'International',
		'Investigative Journalism',
	];

	categoryOptions = categoryOptions?.map((option) => ({
		text: option,
		value: option,
	}));

	const options2 = elementBuilder.createDropdownOptions(categoryOptions);
	const categoryDropdown = elementBuilder.createMultiStaticSelectDropdown(
		{
			text: 'Category',
			options: options2,
		},
		{
			blockId: 'category-dropdown-block-id',
			actionId: 'category-dropdown-action-id',
		}
	);
	const categoryDropDownBlock = blockBuilder.createSectionBlock({
		text: 'Select Categories to subscribe',
		accessory: categoryDropdown,
		blockId: 'categoryy-dropdown-block-id',
	});
	blocks.push(categoryDropDownBlock);
	blocks.push(dividerBlock);

	const channelDropdown = elementBuilder.createChannelSelectDropdown(
		{
			appId: app.getID(),
		},
		{
			blockId: 'channel-dropdown-block-id',
			actionId: 'channel-dropdown-action-id',
		}
	);

	const channelDropdownBlock = blockBuilder.createActionBlock({
		blockId: 'channell-dropdown-block-id',
		elements: [channelDropdown],
	});
	console.log('c', channelDropdownBlock);
	console.log('app: ', app);
	console.log('read: ', read);

	blocks.push(channelDropdownBlock);

	const submitButton = elementBuilder.createButton(
		{
			text: ModalEnum.SUBSCRIBE_NEWS_SUBMIT_BUTTON,
			style: ButtonStyle.PRIMARY,
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
