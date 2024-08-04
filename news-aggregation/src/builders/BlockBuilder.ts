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

/**
 * Implements IBlockBuilder to create various UI blocks for the Rocket.Chat UI Kit.
 */
export class BlockBuilder implements IBlockBuilder {
	constructor(private readonly appId: string) {}

	/**
	 * Creates an array of TextObject instances from an array of strings.
	 * @param fields - Array of strings to be converted into TextObject.
	 * @returns Array of TextObject.
	 */
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

	/**
	 * Creates a SectionBlock instance.
	 * @param param - Parameters for the SectionBlock.
	 * @returns SectionBlock instance.
	 */
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

	/**
	 * Creates an ActionsBlock instance.
	 * @param param - Parameters for the ActionsBlock.
	 * @returns ActionsBlock instance.
	 */
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

	/**
	 * Creates a PreviewBlock instance, either with or without a thumbnail.
	 * @param param - Parameters for the PreviewBlock.
	 * @returns PreviewBlockBase or PreviewBlockWithThumb instance.
	 */
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

	/**
	 * Creates a ContextBlock instance.
	 * @param param - Parameters for the ContextBlock.
	 * @returns ContextBlock instance.
	 */
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

	/**
	 * Creates an InputBlock instance.
	 * @param param - Parameters for the InputBlock.
	 * @returns InputBlock instance.
	 */
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

	/**
	 * Creates a DividerBlock instance.
	 * @param blockId - Optional blockId for the DividerBlock.
	 * @returns DividerBlock instance.
	 */
	public createDividerBlock(blockId?: string | undefined): DividerBlock {
		const block: DividerBlock = {
			type: LayoutBlockType.DIVIDER,
			appId: this.appId,
			blockId,
		};

		return block;
	}

	/**
	 * Creates a Markdown block.
	 * @param param - Parameters for the Markdown block.
	 * @returns Markdown block instance.
	 */
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
