import {
	IHttp,
	IModify,
	IPersistence,
	IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { NewsAggregationApp } from '../NewsAggregationApp';
import { NewsItem } from './NewsItem';
import { INewsSourceAdapter } from '../src/adapters/INewsSourceAdapter';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';

/**
 * The NewsSource class is responsible for interacting with a news source adapter
 * to fetch and categorize news items.
 */
export class NewsSource {
	adapter: INewsSourceAdapter;

	/**
	 * Constructor for the NewsSource class.
	 * @param adapter - An adapter that implements the INewsSourceAdapter interface.
	 */
	constructor(adapter: INewsSourceAdapter) {
		this.adapter = adapter;
	}

	/**
	 * Fetches news items from the adapter.
	 * @param read - The read accessor for reading Rocket.Chat data.
	 * @param modify - The modify accessor for modifying Rocket.Chat data.
	 * @param http - The http accessor for making HTTP requests.
	 * @param persis - The persistence accessor for storing data persistently.
	 * @returns A promise that resolves to an array of NewsItem objects.
	 */
	public async fetchNews(
		read: IRead,
		modify: IModify,
		http: IHttp,
		persis: IPersistence
	): Promise<NewsItem[]> {
		return this.adapter.fetchNews(read, modify, http, persis);
	}

	/**
	 * Determines the category for the provided news items.
	 * @param newsItems - An array of news items to categorize.
	 * @returns A promise that resolves when the category determination is complete.
	 */
	public async determineCategory(
		newsItems: NewsItem[],
		read: IRead,
		room: IRoom,
		user: IUser,
		modify: IModify,
		http: IHttp
	) {
		return this.adapter.determineCategory(
			newsItems,
			read,
			room,
			user,
			modify,
			http
		);
	}
}
