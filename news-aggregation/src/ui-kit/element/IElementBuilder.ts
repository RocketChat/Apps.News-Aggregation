import {
	ButtonElement,
	ChannelsSelectElement,
	ImageElement,
	MultiStaticSelectElement,
	Option,
	PlainTextInputElement,
	StaticSelectElement,
} from '@rocket.chat/ui-kit';
import { ButtonParam } from './IButtonElement';
import { ElementInteractionParam } from './IInteractionElement';
import {
	StaticSelectOptionParam,
	StaticSelectParam,
} from './IStaticSelectElement';
import { MultiStaticSelectParam } from './IMultiStaticSelectElement';
import { ImageParam } from './IImageElement';
import { PlainTextInputParam } from './IPlainTextInputElement';
import { ChannelSelectParam } from './IChannelSelectElement';

/**
 * Interface for creating various UI elements used in Rocket.Chat apps.
 */
export interface IElementBuilder {
	/**
	 * Creates a ButtonElement.
	 * @param param - Parameters for the button element.
	 * @param interactionParam - Parameters related to interaction with the button.
	 * @returns The created ButtonElement.
	 */
	createButton(
		param: ButtonParam,
		interactionParam: ElementInteractionParam
	): ButtonElement;

	/**
	 * Creates a StaticSelectElement dropdown.
	 * @param param - Parameters for the static select dropdown.
	 * @param interactionParam - Parameters related to interaction with the dropdown.
	 * @returns The created StaticSelectElement.
	 */
	createDropdown(
		param: StaticSelectParam,
		interactionParam: ElementInteractionParam
	): StaticSelectElement;

	/**
	 * Creates options for a StaticSelectElement dropdown.
	 * @param param - Parameters for the static select options.
	 * @returns An array of options for the static select dropdown.
	 */
	createDropdownOptions(param: StaticSelectOptionParam): Array<Option>;

	/**
	 * Creates a MultiStaticSelectElement dropdown.
	 * @param param - Parameters for the multi-static select dropdown.
	 * @param interactionParam - Parameters related to interaction with the dropdown.
	 * @returns The created MultiStaticSelectElement.
	 */
	createMultiStaticSelectDropdown(
		param: MultiStaticSelectParam,
		interactionParam: ElementInteractionParam
	): MultiStaticSelectElement;

	/**
	 * Creates an ImageElement.
	 * @param param - Parameters for the image element.
	 * @returns The created ImageElement.
	 */
	createImage(param: ImageParam): ImageElement;

	/**
	 * Creates a PlainTextInputElement.
	 * @param param - Parameters for the plain text input element.
	 * @param interactionParam - Parameters related to interaction with the input.
	 * @returns The created PlainTextInputElement.
	 */
	createPlainTextInput(
		param: PlainTextInputParam,
		interactionParam: ElementInteractionParam
	): PlainTextInputElement;

	/**
	 * Creates a ChannelsSelectElement dropdown.
	 * @param param - Parameters for the channel select dropdown.
	 * @param interactionParam - Parameters related to interaction with the dropdown.
	 * @returns The created ChannelsSelectElement.
	 */
	createChannelSelectDropdown(
		param: ChannelSelectParam,
		interactionParam: ElementInteractionParam
	): ChannelsSelectElement;
}
