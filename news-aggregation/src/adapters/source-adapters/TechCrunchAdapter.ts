import {
	IRead,
	IModify,
	IHttp,
	IPersistence,
} from '@rocket.chat/apps-engine/definition/accessors';
import { NewsAggregationApp } from '../../../NewsAggregationApp';
import { NewsItem } from '../../../definitions/NewsItem';
import { INewsSourceAdapter } from '../INewsSourceAdapter';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { generateRandomId } from '../../utils/generateRandomId';
import { createTextCompletion } from '../../utils/createTextCompletion';
import { shuffleArray } from '../../utils/shuffleArray';

/**
 * TechCrunchAdapter class implements INewsSourceAdapter.
 * Handles fetching and categorizing news from TechCrunch.
 */
export class TechCrunchAdapter implements INewsSourceAdapter {
	app: NewsAggregationApp;
	newsItems: NewsItem[] = [];
	fetchUrl: string = `https://techcrunch.com/wp-json/wp/v2/posts`;
	categoryUrl: string = `https://techcrunch.com/wp-json/wp/v2/categories`;

	/**
	 * Fetches news items from TechCrunch API and transforms them into NewsItem format.
	 * @returns A promise that resolves to an array of NewsItem
	 */
	public async fetchNews(
		read: IRead,
		modify: IModify,
		http: IHttp,
		persis: IPersistence
	): Promise<NewsItem[]> {
		try {
			const response = await http.get(this.fetchUrl);

			console.log('Res:', response.data, 'Done');

			this.newsItems = response?.data?.map((newsItem) => ({
				id: generateRandomId({
					source: 'TechCrunch',
					title: newsItem.yoast_head_json.title.replace(' | TechCrunch', ''),
				}),
				title: newsItem.yoast_head_json.title.replace(' | TechCrunch', ''),
				description: newsItem.yoast_head_json.description,
				link: newsItem.link,
				image: newsItem.jetpack_featured_media_url,
				source: 'TechCrunch',
				author: newsItem.yoast_head_json.author,
				publishedAt: new Date(newsItem.date),
			}));
			console.log('NewsItems:', this.newsItems);
		} catch (err) {
			console.error(err); // for development purposes
			this.app.getLogger().error(err);
		}

		console.log('fetched from techcrunch');
		return this.newsItems;
	}

	/**
	 * Determines categories for the fetched news items using text completion.
	 * @returns A promise that resolves to the categories of the news items
	 */
	public async determineCategory(
		newsItems: NewsItem[],
		read: IRead,
		room: IRoom,
		user: IUser,
		modify: IModify,
		http: IHttp
	) {
		// Prepare prompts for text completion
		const prompts = newsItems.map((newsItem) => ({
			id: newsItem?.id,
			prompt: newsItem?.description,
		}));
		console.log('prmot', prompts);
		// this.app.getLogger().info(prompts);
		// modify.

		console.log('lol');

		// Generate categories using text completion
		const categories = await createTextCompletion(
			read,
			room,
			user,
			modify,
			http,
			prompts
		);
		console.log('llm-responsetc: ', categories);

		return categories;
	}
}
