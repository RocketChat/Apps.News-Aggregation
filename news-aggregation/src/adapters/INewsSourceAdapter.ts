import {
	IHttp,
	IModify,
	IPersistence,
	IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { NewsItem } from '../../definitions/NewsItem';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';

/**
 * Interface for news source adapters.
 * Defines methods for fetching news and determining news categories.
 */
export interface INewsSourceAdapter {
	/**
	 * Fetches news items from the news source.
	 * @returns A promise that resolves to an array of news items
	 */
	fetchNews(
		read: IRead,
		modify: IModify,
		http: IHttp,
		persis: IPersistence
	): Promise<NewsItem[]>;

	/**
	 * Determines the category of news items based on the provided parameters.
	 * @param newsItems - Array of news items to categorize
	 * @returns A promise that resolves when categorization is complete
	 */
	determineCategory(
		newsItems: NewsItem[],
		read: IRead,
		room: IRoom,
		user: IUser,
		modify: IModify,
		http: IHttp
	);
}
