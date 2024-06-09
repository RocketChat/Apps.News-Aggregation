import { ButtonElement, PlainText } from '@rocket.chat/ui-kit';

export type ButtonParam = Pick<
	ButtonElement,
	'url' | 'value' | 'style' | 'secondary'
> & {
	text: PlainText;
};
