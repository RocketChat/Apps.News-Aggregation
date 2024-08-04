import { MultiStaticSelectElement } from '@rocket.chat/ui-kit';

export type MultiStaticSelectParam = Omit<
	MultiStaticSelectElement,
	'type' | 'blockId' | 'actionId' | 'placeholder' | 'appId'
> & { text: string };
