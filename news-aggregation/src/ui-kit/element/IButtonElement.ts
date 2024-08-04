import { ButtonElement } from '@rocket.chat/ui-kit';

/**
 * Parameters for creating a ButtonElement.
 * This type includes specific properties from the original ButtonElement type.
 */
export type ButtonParam = Pick<ButtonElement, 'url' | 'value' | 'style'> & {
	/**
	 * The text label for the button.
	 */
	text: string;
};
