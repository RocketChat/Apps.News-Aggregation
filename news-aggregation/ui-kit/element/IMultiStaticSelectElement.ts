import { MultiStaticSelectElement, TextObject } from '@rocket.chat/ui-kit';

export type MultiStaticSelectParam = Omit<
	MultiStaticSelectElement,
	'type' | 'blockId' | 'actionId' | 'placeholder' | 'appId'
> & { placeholder: TextObject };
