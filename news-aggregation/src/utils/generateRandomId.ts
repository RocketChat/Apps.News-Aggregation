import { createHash } from 'crypto';

export type PartialNewsItem = {
	source: string;
	title: string;
};

/**
 * Generates a unique identifier for a news item based on its source and title.
 *
 * @param newsItem - An object containing the source and title of the news item.
 * @returns A unique identifier string.
 */
export function generateRandomId(newsItem: PartialNewsItem): string {
	// Create a SHA-256 hash of the concatenated source and title
	return createHash('sha256')
		.update(`${newsItem.source}/${newsItem.title}`)
		.digest('hex')
		.slice(0, 36);
}
