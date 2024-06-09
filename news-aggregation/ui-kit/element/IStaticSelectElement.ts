import { StaticSelectElement, TextObject } from '@rocket.chat/ui-kit';

export type StaticSelectParam = Pick<
	StaticSelectElement,
	| 'options'
	| 'optionGroups'
	| 'initialOption'
	| 'initialValue'
	| 'dispatchActionConfig'
> & { placeholder: TextObject };

export type StaticSelectOptionParam = Array<{
	text: TextObject;
	value: string;
	description?: string;
	url?: string;
}>;
