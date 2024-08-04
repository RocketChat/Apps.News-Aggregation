import { InputBlock } from '@rocket.chat/ui-kit';

/**
 * Parameters for creating an InputBlock.
 * This type omits certain properties from the original InputBlock type.
 */
export type InputBlockParam = Omit<InputBlock, 'type' | 'appId' | 'label'> & {
	/**
	 * The text to be displayed in the input block.
	 * This is a required field.
	 */
	text: string;
};
