import { ImageElement } from '@rocket.chat/ui-kit';

/**
 * Parameters for creating a ContextBlock.
 */
export type ContextBlockParam = {
	/**
	 * The elements to be displayed in the context block.
	 * This can be an array of strings (for text) or ImageElements.
	 */
	contextElements: Array<string | ImageElement>;

	/**
	 * Optional. A unique identifier for the ContextBlock.
	 * This is useful for distinguishing between different blocks.
	 */
	blockId?: string;
};
