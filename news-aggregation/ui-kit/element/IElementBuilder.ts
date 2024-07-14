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

export interface IElementBuilder {
	createButton(
		param: ButtonParam,
		interactionParam: ElementInteractionParam
	): ButtonElement;

	createDropdown(
		param: StaticSelectParam,
		interactionParam: ElementInteractionParam
	): StaticSelectElement;

	createDropdownOptions(param: StaticSelectOptionParam): Array<Option>;

	createMultiStaticSelectDropdown(
		param: MultiStaticSelectParam,
		interactionParam: ElementInteractionParam
	): MultiStaticSelectElement;

	createImage(param: ImageParam): ImageElement;

	createPlainTextInput(
		param: PlainTextInputParam,
		interactionParam: ElementInteractionParam
	): PlainTextInputElement;

	createChannelSelectDropdown(
		param: ChannelSelectParam,
		interactionParam: ElementInteractionParam
	): ChannelsSelectElement;
}
