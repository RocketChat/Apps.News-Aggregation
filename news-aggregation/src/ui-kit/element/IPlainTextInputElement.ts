import { PlainTextInputElement } from '@rocket.chat/ui-kit';

/**
 * Parameters for creating a PlainTextInputElement.
 */
export type PlainTextInputParam = Omit<
	PlainTextInputElement,
	'type' | 'placeholder' | 'appId' | 'blockId' | 'actionId'
> & {
	/**
	 * The text value of the PlainTextInput element.
	 */
	text: string;
};
