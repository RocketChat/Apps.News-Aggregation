// import { IJobContext, IProcessor } from "@rocket.chat/apps-engine/definition/scheduler";
// import { NewsAggregationApp } from "../NewsAggregationApp";
// import { IRead, IModify, IHttp, IPersistence } from "@rocket.chat/apps-engine/definition/accessors";
// import { NewsItem } from "../definitions/NewsItem";
// import { IUser } from "@rocket.chat/apps-engine/definition/users";
// import { NewsItemPersistence } from "../persistence/NewsItemPersistence";
// import { buildNewsBlock } from "../blocks/UtilityBlocks";
// import { sendMessage } from "../utils/message";
// import { Block } from "@rocket.chat/ui-kit";

// export class DailyNewsProcessor implements IProcessor {
//     id: string = 'daily-news';
//     app: NewsAggregationApp;

//     constructor(app: NewsAggregationApp) {
//         this.app = app;
//     }

//     public async processor(jobContext: IJobContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
//         let news: NewsItem[] = [];
// 				const appUser = (await this.read.getUserReader().getAppUser()) as IUser;

// 				// const techCrunchAdapter = new TechCrunchAdapter();
// 				// const techCrunchNewsSource = new NewsSource(
// 				// 	this.app,
// 				// 	techCrunchAdapter,
// 				// 	news
// 				// );

// 				const newsStorage = new NewsItemPersistence({
// 					read: this.read,
// 					modify: this.modify,
// 					persistence: this.persistence,
// 				});

// 				const subscriptionStorage = new SubscriptionPersistence(
// 					this.app,
// 					this.persistenceRead,
// 					this.persistence
// 				);
// 				const subscription = await subscriptionStorage.getSubscriptionByRoom(
// 					this.room
// 				);

// 				try {
// 					// news = await techCrunchNewsSource.getNews(
// 					// 	this.read,
// 					// 	this.modify,
// 					// 	this.room,
// 					// 	this.http,
// 					// 	this.persistence
// 					// );
// 					// news = (await newsStorage.getAllNews()) as NewsItem[];
// 					// news = (await newsStorage.getAllSubscribedNews(subscription.categories))

// 					// get only the news of subscribed categories
// 					if (subscription?.categories) {
// 						for (const category of subscription?.categories) {
// 							news = (await newsStorage.getAllSubscribedNews(
// 								category
// 							)) as NewsItem[];

// 							for (const item of news) {
// 								const newsBlock = await buildNewsBlock(item);
// 								// newsBlocks.push(newsBlock);
// 								await sendMessage(
// 									this.modify,
// 									this.room,
// 									appUser,
// 									'',
// 									newsBlock
// 								);
// 							}
// 						}
// 					}
// 					console.log('fetched!!', news, 'FETCHED FROM PERSISTENCE!');

// 					// To implement
// 					let newsBlocks: Array<Array<Block>> = [];
// 					// for (const item of news) {
// 					// 	const newsBlock = await buildNewsBlock(item);
// 					// 	// newsBlocks.push(newsBlock);
// 					// 	await sendMessage(this.modify, this.room, appUser, '', newsBlock);
// 					// }

// 					// await sendNewsMessage(
// 					// 	this.modify,
// 					// 	this.room,
// 					// 	this.sender,
// 					// 	'',
// 					// 	newsBlocks
// 					// );
// 					console.log('news displayed!');
// 				} catch (err) {
// 					this.app.getLogger().error(err);
// 					console.error(err);
// 				}
//     }
// }
