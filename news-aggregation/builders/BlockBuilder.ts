import {
	ActionsBlock,
	ContextBlock,
	DividerBlock,
	InputBlock,
	LayoutBlockType,
	Markdown,
	PreviewBlockBase,
	PreviewBlockWithThumb,
	SectionBlock,
	TextObject,
	TextObjectType,
} from '@rocket.chat/ui-kit';
import { IBlockBuilder } from '../ui-kit/block/IBlockBuilder';
import { SectionBlockParam } from '../ui-kit/block/ISectionBlock';
import { ActionBlockParam } from '../ui-kit/block/IActionBlock';
import { PreviewBlockParam } from '../ui-kit/block/IPreviewBlock';
import { ContextBlockParam } from '../ui-kit/block/IContextBlock';
import { InputBlockParam } from '../ui-kit/block/IInputBlock';
import { MardownBlockParam } from '../ui-kit/block/IMarkdownBlock';

export class BlockBuilder implements IBlockBuilder {
	appId: string;
	constructor(appId: string) {
		this.appId = appId;
	}

	public createTextObjects(fields: Array<string>): Array<TextObject> {
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

	public createSectionBlock(param: SectionBlockParam): SectionBlock {
		const { accessory, blockId, text, fields } = param;

		const block: SectionBlock = {
			type: LayoutBlockType.SECTION,
			text: {
				type: TextObjectType.PLAIN_TEXT,
				text: text ? text : '',
				emoji: true,
			},
			fields: fields ? this.createTextObjects(fields) : undefined,
			accessory,
			appId: this.appId,
			blockId,
		};

		return block;
	}

	public createActionBlock(param: ActionBlockParam): ActionsBlock {
		const { blockId, elements } = param;

		const block: ActionsBlock = {
			type: LayoutBlockType.ACTIONS,
			elements,
			appId: this.appId,
			blockId,
		};

		return block;
	}

	public createPreviewBlock(
		param: PreviewBlockParam
	): PreviewBlockBase | PreviewBlockWithThumb {
		const { title, description, footer, thumb } = param;

		const block: PreviewBlockBase | PreviewBlockWithThumb = {
			type: LayoutBlockType.PREVIEW,
			title: this.createTextObjects(title),
			description: this.createTextObjects(description),
			footer,
			thumb,
		};

		return block;
	}

	public createContextBlock(param: ContextBlockParam): ContextBlock {
		const { contextElements, blockId } = param;

		const elements = contextElements.map((element) => {
			if (typeof element === 'string') {
				return {
					type: TextObjectType.MRKDWN,
					text: element,
				} as TextObject;
			} else {
				return element;
			}
		});

		const block: ContextBlock = {
			type: LayoutBlockType.CONTEXT,
			elements,
			appId: this.appId,
			blockId,
		};

		return block;
	}

	public createInputBlock(param: InputBlockParam): InputBlock {
		const { text, element, blockId, hint, optional } = param;

		const block: InputBlock = {
			type: LayoutBlockType.INPUT,
			label: {
				type: TextObjectType.PLAIN_TEXT,
				text,
				emoji: true,
			},
			element,
			hint,
			optional,
			appId: this.appId,
			blockId,
		};

		return block;
	}

	public createDividerBlock(blockId?: string | undefined): DividerBlock {
		const block: DividerBlock = {
			type: LayoutBlockType.DIVIDER,
			appId: this.appId,
			blockId,
		};

		return block;
	}

	public createMarkdownBlock(param: MardownBlockParam): Markdown {
		const { verbatim } = param;
		const block: Markdown = {
			type: TextObjectType.MRKDWN,
			text: 'HI',
			verbatim,
		};

		return block;
	}
}
