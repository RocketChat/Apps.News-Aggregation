import { SectionBlock } from '@rocket.chat/ui-kit';
import { SectionBlockParam } from './ISectionBlock';

export interface IBlockBuilder {
	createSectionBlock(param: SectionBlockParam): SectionBlock;
}
