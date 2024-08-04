import { ButtonStyle } from '@rocket.chat/apps-engine/definition/uikit';
import { ButtonElement, TextObjectType } from '@rocket.chat/ui-kit';

/**
 * Creates a ButtonElement with the specified parameters.
 *
 * @param text - The text to display on the button.
 * @param blockId - The ID of the block this button belongs to.
 * @param actionId - The ID of the action triggered when the button is pressed.
 * @param appId - The ID of the app creating the button.
 * @param style - The style of the button (optional). Can be primary or danger.
 * @param value - The value associated with the button (optional).
 * @returns A ButtonElement configured with the provided parameters.
 */
export function getButton(
	text: string,
	blockId: string,
	actionId: string,
	appId: string,
	style?: ButtonStyle.PRIMARY | ButtonStyle.DANGER,
	value?: string
) {
	const button: ButtonElement = {
		type: 'button',
		text: {
			type: TextObjectType.PLAIN_TEXT,
			text: text,
			emoji: true,
		},
		appId,
		blockId,
		actionId,
		style,
		value,
	};

	return button;
}
