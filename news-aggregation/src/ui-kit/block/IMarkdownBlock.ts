import { Markdown } from '@rocket.chat/ui-kit';

export type MardownBlockParam = Pick<Markdown, 'verbatim'> & { text: string };
