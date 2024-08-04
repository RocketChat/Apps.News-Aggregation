import { Markdown } from '@rocket.chat/ui-kit';

/**
 * Parameters for creating a Markdown block.
 * This type includes only specific properties from the original Markdown type.
 */
export type MardownBlockParam = Pick<Markdown, 'verbatim'> & {
	/**
	 * The text content of the Markdown block.
	 * This is the actual Markdown content to be rendered.
	 */
	text: string;
};
