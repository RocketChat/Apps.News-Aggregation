import {
	ActionsBlock,
	ContextBlock,
	DividerBlock,
	InputBlock,
	Markdown,
	PreviewBlockBase,
	PreviewBlockWithThumb,
	SectionBlock,
} from '@rocket.chat/ui-kit';
import { SectionBlockParam } from './ISectionBlock';
import { ActionBlockParam } from './IActionBlock';
import { PreviewBlockParam } from './IPreviewBlock';
import { ContextBlockParam } from './IContextBlock';
import { InputBlockParam } from './IInputBlock';
import { MardownBlockParam } from './IMarkdownBlock';

/**
 * Interface for a block builder that creates different types of UI blocks.
 */
export interface IBlockBuilder {
	/**
	 * Creates a SectionBlock with the provided parameters.
	 *
	 * @param param - The parameters for the SectionBlock.
	 * @returns The created SectionBlock.
	 */
	createSectionBlock(param: SectionBlockParam): SectionBlock;

	/**
	 * Creates an ActionsBlock with the provided parameters.
	 *
	 * @param param - The parameters for the ActionsBlock.
	 * @returns The created ActionsBlock.
	 */
	createActionBlock(param: ActionBlockParam): ActionsBlock;

	/**
	 * Creates a PreviewBlock. It can be either a PreviewBlockBase or a PreviewBlockWithThumb,
	 * depending on the parameters provided.
	 *
	 * @param param - The parameters for the PreviewBlock.
	 * @returns The created PreviewBlockBase or PreviewBlockWithThumb.
	 */
	createPreviewBlock(
		param: PreviewBlockParam
	): PreviewBlockBase | PreviewBlockWithThumb;

	/**
	 * Creates a ContextBlock with the provided parameters.
	 *
	 * @param param - The parameters for the ContextBlock.
	 * @returns The created ContextBlock.
	 */
	createContextBlock(param: ContextBlockParam): ContextBlock;

	/**
	 * Creates an InputBlock with the provided parameters.
	 *
	 * @param param - The parameters for the InputBlock.
	 * @returns The created InputBlock.
	 */
	createInputBlock(param: InputBlockParam): InputBlock;

	/**
	 * Creates a DividerBlock. Optionally, a blockId can be provided.
	 *
	 * @param blockId - Optional. The unique identifier for the DividerBlock.
	 * @returns The created DividerBlock.
	 */
	createDividerBlock(blockId?: string): DividerBlock;

	/**
	 * Creates a Markdown block with the provided parameters.
	 *
	 * @param param - The parameters for the Markdown block.
	 * @returns The created Markdown block.
	 */
	createMarkdownBlock(param: MardownBlockParam): Markdown;
}
