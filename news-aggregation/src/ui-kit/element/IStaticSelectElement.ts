import { StaticSelectElement } from '@rocket.chat/ui-kit';

export type StaticSelectParam = Pick<
	StaticSelectElement,
	| 'options'
	| 'optionGroups'
	| 'initialOption'
	| 'initialValue'
	| 'dispatchActionConfig'
> & { placeholder: string };

export type StaticSelectOptionParam = Array<{
	text: string;
	value: string;
	description?: string;
	url?: string;
}>;
