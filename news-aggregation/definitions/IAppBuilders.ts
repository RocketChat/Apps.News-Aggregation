import { BlockBuilder } from '../builders/BlockBuilder';
import { ElementBuilder } from '../builders/ElementBuilder';

export interface IAppBuilders {
	elementBuilder: ElementBuilder;
	blockBuilder: BlockBuilder;
}
