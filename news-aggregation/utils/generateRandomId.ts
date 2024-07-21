import { createHash } from 'crypto';

export type PartialNewsItem = {
	source: string;
	title: string;
};
export function generateRandomId(newsItem: PartialNewsItem): string {
	return createHash('sha256')
		.update(`${newsItem.source}/${newsItem.title}`)
		.digest('hex')
		.slice(0, 36);
}
