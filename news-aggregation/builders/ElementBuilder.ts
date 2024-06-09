import {
	BlockElementType,
	ButtonElement,
	StaticSelectElement,
	TextObjectType,
} from '@rocket.chat/ui-kit';
import { ButtonParam } from '../ui-kit/element/IButtonElement';
import { IElementBuilder } from '../ui-kit/element/IElementBuilder';
import { ElementInteractionParam } from '../ui-kit/element/IInteractionElement';
import { StaticSelectParam } from '../ui-kit/element/IStaticSelectElement';

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
			secondary: secondary,
		};

		return button;
	}

	public createDropdown(
		param: StaticSelectParam,
		interactionParam: ElementInteractionParam
	): StaticSelectElement {
		const {
			options,
			optionGroups,
			initialOption,
			initialValue,
			dispatchActionConfig,
			placeholder,
		} = param;
		const { blockId, actionId } = interactionParam;

		const dropdown: StaticSelectElement = {
			type: BlockElementType.STATIC_SELECT,
			placeholder: {
				type: TextObjectType.PLAIN_TEXT,
				text: placeholder,
				emoji: true,
			},
			options,
			optionGroups,
			initialOption,
			initialValue,
			appId: this.appId,
			blockId,
			actionId,
			dispatchActionConfig,
		};

		return dropdown;
	}
}
