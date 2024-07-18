import {
	IRead,
	IModify,
	IHttp,
	IPersistence,
} from '@rocket.chat/apps-engine/definition/accessors';
import { NewsAggregationApp } from '../../NewsAggregationApp';
import { NewsItem } from '../../definitions/NewsItem';
import { INewsSourceAdapter } from '../INewsSourceAdapter';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';

export class TechCrunchAdapter implements INewsSourceAdapter {
	app: NewsAggregationApp;
	newsItems: NewsItem[] = [];
	fetchUrl: string = `https://techcrunch.com/wp-json/wp/v2/posts`;
	categoryUrl: string = `https://techcrunch.com/wp-json/wp/v2/categories`;

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
				id: newsItem.id.toString(),
				title: newsItem.yoast_head_json.title,
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

	public async determineCategory(
		newsItem: NewsItem,
		read: IRead,
		room: IRoom,
		user: IUser,
		modify: IModify,
		http: IHttp
	): Promise<string> {
		try {
			const response = await http.get(this.fetchUrl);
			const categoryNames: string[] = [];

			if (response?.data) {
				for (const newsItem of response.data) {
					const categoriesId = newsItem.categories;
					const categoryPromises = categoriesId?.map(async (categoryId) => {
						const categoryResponse = await http.get(
							`${this.categoryUrl}/${categoryId}`
						);
						return categoryResponse?.data?.name;
					});
					console.log('cProm: ', categoryPromises);

					if (categoryPromises) {
						const categories = await Promise.all(categoryPromises);
						console.log('cPromAll: ', categories);

						categoryNames.push(...categories.filter(Boolean)); // Add the category names to the array
					}
				}
			}

			// Remove duplicates by converting to a Set and then back to an array
			console.log('catss', categoryNames);
			// return Array.from(new Set(categoryNames));
			return '';
		} catch (err) {
			console.error(err); // for development purposes
			this.app.getLogger().error(err);
			return '';
		}
	}
}
