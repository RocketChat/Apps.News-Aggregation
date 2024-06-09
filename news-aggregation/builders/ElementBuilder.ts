import { ButtonElement, TextObjectType } from '@rocket.chat/ui-kit';
import { ButtonParam } from '../ui-kit/element/IButtonElement';
import { IElementBuilder } from '../ui-kit/element/IElementBuilder';
import { ElementInteractionParam } from '../ui-kit/element/IInteractionElement';

export class ElementBuilder implements IElementBuilder {
	constructor(private readonly appId: string) {}

	public createButton(
		param: ButtonParam,
		interactionParam: ElementInteractionParam
	): ButtonElement {
		const { text, url, value, style, secondary } = param;
		const { blockId, actionId } = interactionParam;

		const button: ButtonElement = {
			type: 'button',
			text: {
				type: TextObjectType.PLAIN_TEXT,
				text: text,
				emoji: true,
			},
			appId: this.appId,
			blockId,
			actionId,
			url,
			value,
			style,
			secondary: false,
		};

		return button;
	}
}
