export class NewsItem {
	id: string;
	title: string;
	description: string;
	link: string;
	image: string;
	source: string;
	author?: string;
	publishedAt?: Date;

	constructor(
		id: string,
		title: string,
		description: string,
		link: string,
		image: string,
		source: string,
		author: string,
		publishedAt: Date
	) {
		this.id = id;
		this.title = title;
		this.description = description;
		this.link = link;
		this.image = image;
		this.source = source;
		this.author = author;
		this.publishedAt = publishedAt;
	}
}
