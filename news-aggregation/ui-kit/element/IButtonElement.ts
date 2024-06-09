import { ButtonElement } from '@rocket.chat/ui-kit';

export type ButtonParam = Pick<
	ButtonElement,
	'url' | 'value' | 'style' | 'secondary'
> & {
	text: string;
};
