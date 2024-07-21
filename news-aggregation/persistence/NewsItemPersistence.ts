import {
	IPersistence,
	IPersistenceRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { NewsItem } from '../definitions/NewsItem';
import {
	RocketChatAssociationModel,
	RocketChatAssociationRecord,
} from '@rocket.chat/apps-engine/definition/metadata';
import { NewsAggregationApp } from '../NewsAggregationApp';
import { IConfig } from '../definitions/IConfig';

export class NewsItemPersistence {
	config: IConfig;
	// app: NewsAggregationApp;
	// persistenceRead: IPersistenceRead;
	// persistence: IPersistence;

	constructor(config: IConfig) {
		this.config = config;
		// this.app = app;
		// this.persistence = persistence;
		// this.persistenceRead = persistenceRead;
	}

	public async newsExists(newsId: string, category: string): Promise<boolean> {
		const associations: Array<RocketChatAssociationRecord> = [
			new RocketChatAssociationRecord(
				RocketChatAssociationModel.MISC,
				'news-aggregation'
			),
			new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, newsId),
			new RocketChatAssociationRecord(
				RocketChatAssociationModel.MISC,
				category
			),
		];

		let news: object[] = [];
		try {
			const persisRead = this.config.read.getPersistenceReader();
			news = await persisRead.readByAssociations(associations);
			if (news.length !== 0) {
				return true;
			}
		} catch (err) {
			// this.app.getLogger().error(err);
			console.error(err);
		}

		return false;
	}

	public async saveNews(news: NewsItem, category: string) {
		const associations: Array<RocketChatAssociationRecord> = [
			new RocketChatAssociationRecord(
				RocketChatAssociationModel.MISC,
				'news-aggregation'
			),
			new RocketChatAssociationRecord(
				RocketChatAssociationModel.MISC,
				category
			),
			new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, news.id),
		];

		let recordId: string;
		if ((await this.newsExists(news.id, category)) === true) {
			console.log('news with this id exists');
			return;
		} else {
			try {
				recordId = await this.config.persistence.createWithAssociations(
					news,
					associations
				);
				console.log('News saved in Persistence!!', recordId);
			} catch (err) {
				console.error('Could not save news in persistence.', err);
				// this.app.getLogger().error('Could not save news in persistence.', err);
			}
		}
	}

	// TO-DO
	// async saveAllNews(allNews: NewsItem[]) {
	//     const associations: Array<RocketChatAssociationRecord> = [
	//         new RocketChatAssociationRecord(
	//             RocketChatAssociationModel.MISC,
	//             "news-aggregation",
	//         ),
	//     ];

	//     const idAssociation = allNews.map((news) => (
	//         new RocketChatAssociationRecord(
	//             RocketChatAssociationModel.MISC,
	//             news.id,
	//         )
	//     ));

	//     associations.push(idAssociation);
	// }

	public async getAllNewsById(newsIds: string[]): Promise<NewsItem[]> {
		const associations: Array<RocketChatAssociationRecord> = [
			new RocketChatAssociationRecord(
				RocketChatAssociationModel.MISC,
				'news-aggregation'
			),
		];

		for (const newsId of newsIds) {
			const currNewsAssociation = new RocketChatAssociationRecord(
				RocketChatAssociationModel.MISC,
				newsId
			);
			associations.push(currNewsAssociation);
		}

		let allNewsObjectArray: NewsItem[];
		try {
			const persisRead = this.config.read.getPersistenceReader();
			allNewsObjectArray = (await persisRead.readByAssociations(
				associations
			)) as NewsItem[];

			if (allNewsObjectArray.length === 0) {
				console.error("News doesn't exist");
				// this.app.getLogger().error("News doesn't exist");
				return allNewsObjectArray;
			}
		} catch (err) {
			allNewsObjectArray = [];
			console.error('Could not get the all news by id', err);
			// this.app.getLogger().error('Could not get the all news by id', err);
		}

		return allNewsObjectArray;
	}

	public async getAllNews(): Promise<object[]> {
		const associations: Array<RocketChatAssociationRecord> = [
			new RocketChatAssociationRecord(
				RocketChatAssociationModel.MISC,
				'news-aggregation'
			),
		];

		let allNewsObjectArray: object[];
		try {
			const persisRead = this.config.read.getPersistenceReader();
			allNewsObjectArray = (await persisRead.readByAssociations(
				associations
			)) as NewsItem[];

			if (allNewsObjectArray.length === 0) {
				console.error("News doesn't exist");
				// this.app.getLogger().error("News doesn't exist");
				return allNewsObjectArray;
			}
			// console.log('news exist in persistence', allNewsObjectArray);
		} catch (err) {
			allNewsObjectArray = [];
			console.error('Could not get the all news by id', err);
			// this.app.getLogger().error('Could not get the all news by id', err);
		}

		console.log('allnews', allNewsObjectArray);

		return allNewsObjectArray;
	}

	public async getAllSubscribedNews(category: string) {
		const associations: Array<RocketChatAssociationRecord> = [
			new RocketChatAssociationRecord(
				RocketChatAssociationModel.MISC,
				'news-aggregation'
			),
			new RocketChatAssociationRecord(
				RocketChatAssociationModel.MISC,
				category
			),
		];

		let newsObjectArray: object[];
		try {
			newsObjectArray = (await this.config.read
				.getPersistenceReader()
				.readByAssociations(associations)) as NewsItem[];

			if (newsObjectArray.length === 0) {
				console.error("News with the given category doesn't exist");
				// this.app
				// 	.getLogger()
				// 	.error("News with the given category doesn't exist");
				return [];
			}
		} catch (err) {
			newsObjectArray = [];
			console.error('Could not get the desired news by category', err);
			// this.app
			// 	.getLogger()
			// 	.error('Could not get the desired news by category', err);
		}

		console.log('catNews: ', newsObjectArray);

		return newsObjectArray;
	}

	public async getNewsById(newsId: string, source: string): Promise<object> {
		const associations: Array<RocketChatAssociationRecord> = [
			new RocketChatAssociationRecord(
				RocketChatAssociationModel.MISC,
				'news-aggregation'
			),
			new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, source),
			new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, newsId),
		];

		let newsObject: object = {};
		try {
			const persisRead = this.config.read.getPersistenceReader();
			let newsObjectArray: object[];
			newsObjectArray = await persisRead.readByAssociations(associations);

			if (newsObjectArray.length === 0) {
				console.error("News with the given id doesn't exist");
				// this.app.getLogger().error("News with the given id doesn't exist");
				return {};
			}

			for (const news of newsObjectArray) {
				newsObject = news;
			}
		} catch (err) {
			newsObject = {};
			console.error('Could not get the desired news by id', err);
			// this.app.getLogger().error('Could not get the desired news by id', err);
		}

		console.log('fefw', newsObject);

		return newsObject;
	}

	public async removeNewsById(news: NewsItem) {
		const associations: Array<RocketChatAssociationRecord> = [
			new RocketChatAssociationRecord(
				RocketChatAssociationModel.MISC,
				'news-aggregation'
			),
			new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, news.id),
		];

		// const newsToBeDeleted = await this.getNewsById(newsId);

		let removedNews: object[];
		try {
			removedNews =
				await this.config.persistence.removeByAssociations(associations);
		} catch (err) {
			removedNews = [];
			console.error('Could not remove desired news from persistence.', err);
			// this.app
			// 	.getLogger()
			// 	.error('Could not remove desired news from persistence.', err);
		}
	}

	public async removeAllNews() {
		const associations: Array<RocketChatAssociationRecord> = [
			new RocketChatAssociationRecord(
				RocketChatAssociationModel.MISC,
				'news-aggregation'
			),
		];

		try {
			await this.config.persistence.removeByAssociations(associations);
			console.log('removed!');
		} catch (err) {
			console.error('Could not remove all news from persistence.', err);
			// this.app
			// 	.getLogger()
			// 	.error('Could not remove all news from persistence.', err);
		}
	}
}
