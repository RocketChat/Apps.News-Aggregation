import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { ISubscription } from '../definitions/ISubscription';
import { NewsItem } from '../definitions/NewsItem';
import { IModify, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { NewsItemPersistence } from '../persistence/NewsItemPersistence';
import { shuffleArray } from './shuffleArray';
import { buildNewsBlock } from '../blocks/UtilityBlocks';
import { sendMessage } from './message';
import { IUser } from '@rocket.chat/apps-engine/definition/users';

export async function deliverNews(
	news: NewsItem[],
	read: IRead,
	modify: IModify,
	subscription: ISubscription,
	newsStorage: NewsItemPersistence
) {
	const appUser = (await read.getUserReader().getAppUser()) as IUser;

	let allSubscribedNews: NewsItem[] = [];
	const room = (await read
		.getRoomReader()
		.getById(subscription?.roomId)) as IRoom;

	if (subscription?.categories) {
		if (
			subscription?.categories?.length === 1 &&
			subscription?.categories[0] === 'All Categories'
		) {
			allSubscribedNews = (await newsStorage.getAllNews()) as NewsItem[];
		} else {
			for (const category of subscription?.categories) {
				news = (await newsStorage.getAllSubscribedNews(category)) as NewsItem[];

				news = news.slice(0, 10);
				allSubscribedNews = [...allSubscribedNews, ...news];
			}
		}
	}

	allSubscribedNews = shuffleArray(allSubscribedNews);

	for (const item of allSubscribedNews.slice(0, 10)) {
		const newsBlock = await buildNewsBlock(item);
		// newsBlocks.push(newsBlock);
		await sendMessage(modify, room, appUser, '', newsBlock);
	}
}
