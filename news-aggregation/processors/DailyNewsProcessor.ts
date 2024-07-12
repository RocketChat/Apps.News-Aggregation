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
// 				const appUser = (await read.getUserReader().getAppUser()) as IUser;

// 				// const techCrunchAdapter = new TechCrunchAdapter();
// 				// const techCrunchNewsSource = new NewsSource(
// 				// 	this.app,
// 				// 	techCrunchAdapter,
// 				// 	news
// 				// );

// 				const newsStorage = new NewsItemPersistence(
// 					this.app,
// 					persis,
// 					read.getPersistenceReader(),
// 				);

// 				try {
// 					// news = await techCrunchNewsSource.getNews(
// 					// 	this.read,
// 					// 	this.modify,
// 					// 	this.room,
// 					// 	this.http,
// 					// 	this.persistence
// 					// );
// 					news = (await newsStorage.getAllNews()) as NewsItem[];
// 					console.log('fetched!!', news, 'FETCHED FROM PERSISTENCE daily!');

// 					// To implement
// 					let newsBlocks: Array<Array<Block>> = [];
// 					for (const item of news) {
// 						const newsBlock = await buildNewsBlock(item);
// 						// newsBlocks.push(newsBlock);
// 						await sendMessage(modify, , appUser, '', newsBlock);
// 					}

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
