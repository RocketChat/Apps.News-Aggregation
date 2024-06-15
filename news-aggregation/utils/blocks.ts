import {
	LayoutBlockType,
	SectionBlock,
	TextObject,
	TextObjectType,
} from '@rocket.chat/ui-kit';

export function getTextObjects(fields: Array<string>): Array<TextObject> {
	const objects = fields?.map((field) => {
		const textObject: TextObject = {
			type: TextObjectType.PLAIN_TEXT,
			text: field,
			emoji: true,
		};

		return textObject;
	});

	return objects;
}

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
		fields: fields ? getTextObjects(fields) : undefined,
		accessory,
		appId: this.appId,
		blockId,
	};

	return block;
}
