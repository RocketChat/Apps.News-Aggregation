import { PreviewBlockWithThumb } from '@rocket.chat/ui-kit';

/**
 * Parameters for creating a PreviewBlockWithThumb block.
 * This type includes only specific optional properties from the original PreviewBlockWithThumb type.
 */
export type PreviewBlockParam = Partial<
	Pick<PreviewBlockWithThumb, 'footer' | 'thumb'>
> & {
	/**
	 * The title of the preview block.
	 * This is an array of strings, allowing for multi-line titles.
	 */
	title: Array<string>;

	/**
	 * The description of the preview block.
	 * This is an array of strings, allowing for multi-line descriptions.
	 */
	description: Array<string>;
};
