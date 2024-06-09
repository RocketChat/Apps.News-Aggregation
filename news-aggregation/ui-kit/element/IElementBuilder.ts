import {
	ButtonElement,
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

	createImage(
		param: ImageParam,
		interactionParam: ElementInteractionParam
	): ImageElement;

	createPlainTextInput(
		param: PlainTextInputParam,
		interactionParam: ElementInteractionParam
	): PlainTextInputElement;
}
