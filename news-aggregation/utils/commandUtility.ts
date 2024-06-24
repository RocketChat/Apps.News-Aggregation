import { IUser } from '@rocket.chat/apps-engine/definition/users';
import {
	ICommandUtility,
	ICommandUtilityParams,
} from '../definitions/ICommandUtility';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import {
	IHttp,
	IModify,
	IPersistence,
	IPersistenceRead,
	IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { NewsAggregationApp } from '../NewsAggregationApp';
import { CommandEnum } from '../enums/commandEnum';
import { sendHelperMessage, sendMessage } from './message';
import { TechCrunchAdapter } from '../adapters/source-adapters/TechCrunchAdapter';
import { NewsItem } from '../definitions/NewsItem';
import { NewsSource } from '../definitions/NewsSource';
import { NewsFetchService } from '../services/NewsFetchService';
import { Handler } from '../handlers/Handler';
import { NewsItemPersistence } from '../persistence/NewsItemPersistence';
import { Block } from '@rocket.chat/ui-kit';
import { buildNewsBlock } from '../blocks/UtilityBlocks';
import { sendNewsMessage } from './sendNewsMessage';

export class CommandUtility implements ICommandUtility {
	sender: IUser;
	room: IRoom;
	command: string[];
	context: SlashCommandContext;
	read: IRead;
	modify: IModify;
	http: IHttp;
	persistence: IPersistence;
	persistenceRead: IPersistenceRead;
	app: NewsAggregationApp;
	triggerId?: string | undefined;
	// news: NewsItem[];

	constructor(props: ICommandUtilityParams) {
		this.sender = props.sender;
		this.room = props.room;
		this.command = props.command;
		this.context = props.context;
		this.read = props.read;
		this.modify = props.modify;
		this.http = props.http;
		this.persistence = props.persistence;
		this.persistenceRead = props.persistenceRead;
		this.app = props.app;
		this.triggerId = props.triggerId;
	}

	private async helperMessage() {
		await sendHelperMessage(
			this.room,
			this.read,
			this.modify,
			this.sender,
			this.http,
			this.persistence
		);
	}

	private async fetchNewsFromSource() {
		let newsItems: NewsItem[] = [];
		// const techCrunchAdapter = new TechCrunchAdapter();
		// const techCrunchNewsSource = new NewsSource(
		// 	this.app,
		// 	techCrunchAdapter,
		// 	// this.news
		// 	news
		// );
		// news = await techCrunchNewsSource.fetchNews(
		// 	this.read,
		// 	this.modify,
		// 	this.room,
		// 	this.http,
		// 	this.persistence
		// );

		// await techCrunchNewsSource.saveNews(this.persistence, this.persistenceRead);

		// const fetchService = new NewsFetchService(
		// 	this.app,
		// 	this.persistence,
		// 	this.persistenceRead
		// );
		// await fetchService.fetchNewsAndStore(this.read, this.modify, this.http);
	}

	public async getNewsFromPersistence() {
		let news: NewsItem[] = [];

		const techCrunchAdapter = new TechCrunchAdapter();
		const techCrunchNewsSource = new NewsSource(
			this.app,
			techCrunchAdapter,
			// this.news
			news
		);

		const newsStorage = new NewsItemPersistence(
			this.app,
			this.persistence,
			this.persistenceRead
		);

		try {
			// news = await techCrunchNewsSource.getNews(
			// 	this.read,
			// 	this.modify,
			// 	this.room,
			// 	this.http,
			// 	this.persistence
			// );
			news = (await newsStorage.getAllNews()) as NewsItem[];
			console.log('fetched!!', news, 'FETCHED FROM PERSISTENCE!');

			let newsBlocks: Array<Array<Block>> = [];
			for (const item of news) {
				const newsBlock = await buildNewsBlock(item);
				// newsBlocks.push(newsBlock);

				await sendMessage(this.modify, this.room, this.sender, '', newsBlock);
			}

			// await sendNewsMessage(
			// 	this.modify,
			// 	this.room,
			// 	this.sender,
			// 	'',
			// 	newsBlocks
			// );
			console.log('news displayed!');
		} catch (err) {
			console.error(err);
		}
	}

	public async deleteNewsFromPersistence() {
		// let news: NewsItem[] = [];
		// const techCrunchAdapter = new TechCrunchAdapter();
		// const techCrunchNewsSource = new NewsSource(
		// 	this.app,
		// 	techCrunchAdapter,
		// 	news
		// );

		// try {
		// 	await techCrunchNewsSource.deleteNews(
		// 		this.read,
		// 		this.modify,
		// 		this.room,
		// 		this.http,
		// 		this.persistence
		// 	);

		// 	console.log('all news deleted!');
		// } catch (err) {
		// 	console.error(err);
		// }

		const fetchService = new NewsFetchService(
			this.app,
			this.persistence,
			this.persistenceRead
		);
		await fetchService.deleteNewsScheduler(
			this.read,
			this.modify,
			this.room,
			this.http,
			this.persistence
		);
	}

	public async subscribeNews() {
		console.log('news subscribe working.');
		this.app.getLogger().info('news subscribe working.');
	}

	public async unsubscribeNews() {
		console.log('news unsubscribe working.');
		this.app.getLogger().info('news unsubscribe working.');
	}

	private async handleSingleParamCommand(handler: Handler) {
		const singleParamCommand = this.command[0];

		switch (singleParamCommand) {
			case CommandEnum.ALERT:
				await this.fetchNewsFromSource();
				break;

			case CommandEnum.GET:
				await this.getNewsFromPersistence();
				break;

			case CommandEnum.DELETE:
				await this.deleteNewsFromPersistence();
				break;

			case CommandEnum.SUBSCRIBE:
				await handler.subscribeNews();
				break;

			case CommandEnum.UNSUBSCRIBE:
				await handler.unsubscribeNews();
				break;

			case CommandEnum.HELP:
			default:
				await this.helperMessage();
				break;
		}
	}

	private async handleDualParamCommand() {
		console.log('dual param executed');
		this.app.getLogger().info('dual param executed');
	}

	public async resolveCommand(): Promise<void> {
		const handler = new Handler({
			app: this.app,
			sender: this.sender,
			room: this.room,
			read: this.read,
			modify: this.modify,
			http: this.http,
			persistence: this.persistence,
			persistenceRead: this.persistenceRead,
			triggerId: this.triggerId,
		});
		switch (this.command.length) {
			case 1: {
				await this.handleSingleParamCommand(handler);
				break;
			}

			case 2: {
				await this.handleDualParamCommand();
				break;
			}

			case 0:
			default:
				await this.helperMessage();
				break;
		}
	}
}
