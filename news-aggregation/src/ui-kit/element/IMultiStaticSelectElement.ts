import { MultiStaticSelectElement } from '@rocket.chat/ui-kit';

/**
 * Parameters for creating a MultiStaticSelectElement.
 */
export type MultiStaticSelectParam = Omit<
	MultiStaticSelectElement,
	'type' | 'blockId' | 'actionId' | 'placeholder' | 'appId'
> & {
	/**
	 * The text label displayed for the MultiStaticSelect element.
	 */
	text: string;
};
