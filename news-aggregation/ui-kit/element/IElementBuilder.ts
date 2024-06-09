import { ButtonElement } from '@rocket.chat/ui-kit';
import { ButtonParam } from './IButtonElement';
import { ElementInteractionParam } from './IInteractionElement';

export interface IElementBuilder {
	createButton(
		param: ButtonParam,
		interactionParam: ElementInteractionParam
	): ButtonElement;
}
