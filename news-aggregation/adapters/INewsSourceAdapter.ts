import {
	IHttp,
	IModify,
	IPersistence,
	IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { NewsItem } from '../definitions/NewsItem';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';

export interface INewsSourceAdapter {
	fetchNews(
		read: IRead,
		modify: IModify,
		http: IHttp,
		persis: IPersistence
	): Promise<NewsItem[]>;

	determineCategory(
		newsItems: NewsItem[],
		read: IRead,
		room: IRoom,
		user: IUser,
		modify: IModify,
		http: IHttp
	);
}
