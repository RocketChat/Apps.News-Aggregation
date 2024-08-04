/**
 * Represents a news item with details from various sources.
 * Stores information such as the title, description, source, and more.
 */
export class NewsItem {
	id: string;
	title: string;
	description: string;
	link: string;
	image: string;
	source: string;
	category?: string;
	author?: string;
	publishedAt?: Date;

	constructor(
		id: string,
		title: string,
		description: string,
		link: string,
		image: string,
		source: string,
		category: string,
		author: string,
		publishedAt: Date
	) {
		this.id = id;
		this.title = title;
		this.description = description;
		this.link = link;
		this.image = image;
		this.source = source;
		this.category = category;
		this.author = author;
		this.publishedAt = publishedAt;
	}
}
