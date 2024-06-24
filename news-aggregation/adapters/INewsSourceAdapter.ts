import {
	IHttp,
	IModify,
	IPersistence,
	IPersistenceRead,
	IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { NewsItem } from '../definitions/NewsItem';

export interface INewsSourceAdapter {
	fetchNews(
		read: IRead,
		modify: IModify,
		http: IHttp,
		persis: IPersistence
	): Promise<NewsItem[]>;

	// saveNews(
	// 	persistence: IPersistence,
	// 	persistenceRead: IPersistenceRead
	// ): Promise<any>;

	// getNews(
	// 	read: IRead,
	// 	modify: IModify,
	// 	room: IRoom,
	// 	http: IHttp,
	// 	persis: IPersistence
	// ): Promise<NewsItem[]>;

	// deleteNews(
	// 	read: IRead,
	// 	modify: IModify,
	// 	room: IRoom,
	// 	http: IHttp,
	// 	persis: IPersistence
	// ): Promise<any>;
}
