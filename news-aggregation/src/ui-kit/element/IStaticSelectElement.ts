import { StaticSelectElement } from '@rocket.chat/ui-kit';

/**
 * Parameters for creating a StaticSelectElement.
 */
export type StaticSelectParam = Pick<
	StaticSelectElement,
	| 'options'
	| 'optionGroups'
	| 'initialOption'
	| 'initialValue'
	| 'dispatchActionConfig'
> & {
	/**
	 * The placeholder text to display when no option is selected.
	 */
	placeholder: string;
};

/**
 * Parameters for defining options in a StaticSelectElement.
 */
export type StaticSelectOptionParam = Array<{
	text: string;
	value: string;
	description?: string;
	url?: string;
}>;
