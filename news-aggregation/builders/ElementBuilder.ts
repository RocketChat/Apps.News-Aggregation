import {
	BlockElementType,
	ButtonElement,
	ImageElement,
	MultiStaticSelectElement,
	Option,
	PlainTextInputElement,
	StaticSelectElement,
	TextObjectType,
} from '@rocket.chat/ui-kit';
import { ButtonParam } from '../ui-kit/element/IButtonElement';
import { IElementBuilder } from '../ui-kit/element/IElementBuilder';
import { ElementInteractionParam } from '../ui-kit/element/IInteractionElement';
import {
	StaticSelectOptionParam,
	StaticSelectParam,
} from '../ui-kit/element/IStaticSelectElement';
import { MultiStaticSelectParam } from '../ui-kit/element/IMultiStaticSelectElement';
import { ImageParam } from '../ui-kit/element/IImageElement';
import { PlainTextInputParam } from '../ui-kit/element/IPlainTextInputElement';

export class ElementBuilder implements IElementBuilder {
	constructor(private readonly appId: string) {}

	public createButton(
		param: ButtonParam,
		interactionParam: ElementInteractionParam
	): ButtonElement {
		const { text, url, value, style } = param;
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

	public createDropdownOptions(param: StaticSelectOptionParam): Option[] {
		const options: Array<Option> = param?.map((option) => {
			const { text, value, description, url } = option;
			const optionElement: Option = {
				text: {
					type: TextObjectType.PLAIN_TEXT,
					text: text,
					emoji: true,
				},
				value,
				...(description
					? {
							description: {
								type: TextObjectType.PLAIN_TEXT,
								text: description,
							},
						}
					: undefined),
				url,
			};
			return optionElement;
		});

		return options;
	}

	public createMultiStaticSelectDropdown(
		param: MultiStaticSelectParam,
		interactionParam: ElementInteractionParam
	): MultiStaticSelectElement {
		const {
			text,
			options,
			optionGroups,
			maxSelectItems,
			initialOption,
			initialValue,
			dispatchActionConfig,
			confirm,
		} = param;

		const { blockId, actionId } = interactionParam;

		const multiStaticSelectDropdown: MultiStaticSelectElement = {
			type: BlockElementType.MULTI_STATIC_SELECT,
			placeholder: {
				type: TextObjectType.PLAIN_TEXT,
				text: text,
			},
			options,
			optionGroups,
			maxSelectItems,
			initialOption,
			initialValue,
			appId: this.appId,
			blockId,
			actionId,
			dispatchActionConfig,
			confirm,
		};

		return multiStaticSelectDropdown;
	}

	public createImage(param: ImageParam): ImageElement {
		const { imageUrl, altText } = param;
		const image: ImageElement = {
			type: BlockElementType.IMAGE,
			imageUrl,
			altText,
		};

		return image;
	}

	public createPlainTextInput(
		param: PlainTextInputParam,
		interactionParam: ElementInteractionParam
	): PlainTextInputElement {
		const {
			text,
			initialValue,
			multiline,
			minLength,
			maxLength,
			dispatchActionConfig,
		} = param;

		const { blockId, actionId } = interactionParam;

		const input: PlainTextInputElement = {
			type: BlockElementType.PLAIN_TEXT_INPUT,
			placeholder: {
				type: TextObjectType.PLAIN_TEXT,
				text,
				emoji: true,
			},
			appId: this.appId,
			blockId,
			actionId,
			initialValue,
			multiline,
			minLength,
			maxLength,
			dispatchActionConfig,
		};

		return input;
	}
}
