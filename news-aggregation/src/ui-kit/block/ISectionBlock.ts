import { SectionBlock } from '@rocket.chat/ui-kit';

/**
 * Parameters for creating a SectionBlock.
 * This type includes specific properties from the original SectionBlock type.
 */
export type SectionBlockParam = Pick<SectionBlock, 'accessory' | 'blockId'> & {
	/**
	 * The text to be displayed in the section block.
	 * This property is optional.
	 */
	text?: string;

	/**
	 * An array of strings representing fields to be displayed in the section block.
	 * This property is optional.
	 */
	fields?: Array<string>;
};
