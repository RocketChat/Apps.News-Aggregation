import { ButtonStyle } from '@rocket.chat/apps-engine/definition/uikit';
import { ButtonElement, TextObjectType } from '@rocket.chat/ui-kit';

export function getButton(
	text: string,
	blockId: string,
	actionId: string,
	appId: string,
	style?: ButtonStyle.PRIMARY | ButtonStyle.DANGER,
	value?: string,
	secondary?: boolean
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
		secondary: secondary,
	};

	return button;
}
