import {
	ButtonElement,
	Option,
	StaticSelectElement,
} from '@rocket.chat/ui-kit';
import { ButtonParam } from './IButtonElement';
import { ElementInteractionParam } from './IInteractionElement';
import {
	StaticSelectOptionParam,
	StaticSelectParam,
} from './IStaticSelectElement';

export interface IElementBuilder {
	createButton(
		param: ButtonParam,
		interactionParam: ElementInteractionParam
	): ButtonElement;

	createDropdown(
		param: StaticSelectParam,
		interactionParam: ElementInteractionParam
	): StaticSelectElement;

	createDropdownOptions(
		param: StaticSelectOptionParam,
		interactionParam: ElementInteractionParam
	): Array<Option>;
}
