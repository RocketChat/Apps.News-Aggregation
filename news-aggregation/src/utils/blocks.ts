import {
	ActionsBlock,
	Block,
	ButtonElement,
	LayoutBlockType,
	SectionBlock,
	StaticSelectElement,
	TextObject,
	TextObjectType,
} from '@rocket.chat/ui-kit';
import { getButton } from './button';

// Helper function to create TextObject instances from an array of strings
// export function getTextObjects(fields: Array<string>): Array<TextObject> {
// 	const objects = fields?.map((field) => {
// 		const textObject: TextObject = {
// 			type: TextObjectType.PLAIN_TEXT,
// 			text: field,
// 			emoji: true,
// 		};

// 		return textObject;
// 	});

// 	return objects;
// }

// Creates a SectionBlock with optional fields and accessory
export function getSectionBlock(
	blockId: string,
	text: string,
	fields?: Array<string>,
	accessory?: any
	// accessory?:
): SectionBlock {
	const block: SectionBlock = {
		type: LayoutBlockType.SECTION,
		text: {
			type: TextObjectType.PLAIN_TEXT,
			text: text ? text : '',
			emoji: true,
		},
		// fields: fields ? getTextObjects(fields) : undefined,
		accessory,
		appId: this.appId,
		blockId,
	};

	return block;
}

// Creates an ActionsBlock with a list of elements (buttons or static selects)
export function getActionsBlock(
	blockId: string,
	elements: Array<ButtonElement> | Array<StaticSelectElement>
) {
	const block: ActionsBlock = {
		type: 'actions',
		blockId,
		elements,
	};
	return block;
}

// Creates a block array with a subscribe button and an actions block
export async function getSubscribeBlock(appId: string): Promise<Array<Block>> {
	let blocks: Block[] = [];
	const button = getButton(
		'Subscribe',
		'subscribe-block-id',
		'subscribe-action-id',
		appId
	);

	const actionsBlock = getActionsBlock('subscribe-block-id', [button]);
	blocks.push(actionsBlock);
	return blocks;
}
