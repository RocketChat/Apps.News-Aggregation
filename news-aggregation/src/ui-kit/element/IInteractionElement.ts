/**
 * Parameters for interacting with elements in a UI block.
 */
export type ElementInteractionParam = {
	/**
	 * The ID of the block containing the element.
	 */
	blockId: string;

	/**
	 * The ID of the action triggered by interacting with the element.
	 */
	actionId: string;
};
