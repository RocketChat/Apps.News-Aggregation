import { ActionsBlock, SectionBlock } from '@rocket.chat/ui-kit';
import { SectionBlockParam } from './ISectionBlock';
import { ActionBlockParam } from './IActionBlock';

export interface IBlockBuilder {
	createSectionBlock(param: SectionBlockParam): SectionBlock;

	createActionBlock(param: ActionBlockParam): ActionsBlock;

	// createPreviewBlock(
	// 	param: PreviewBlockParam
	// ): PreviewBlockBase | PreviewBlockWithThumb;

	// createContextBlock(param: ContextBlockParam): ContextBlock;

	// createInputBlock(param: InputBlockParam): InputBlock;

	// createDividerBlock(blockId?: string): DividerBlock;
}
