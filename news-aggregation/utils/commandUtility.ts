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
import { Handler } from '../handlers/Handler';
import { BlockBuilder } from '../builders/BlockBuilder';
import { Block, ImageElement } from '@rocket.chat/ui-kit';
import { getSectionBlock } from './blocks';
import { ElementBuilder } from '../builders/ElementBuilder';

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
		let news: NewsItem[] = [];
		// const techCrunchSource = new TechCrunchNewsSource(this.app, news);
		// await techCrunchSource.fetchNews(this.read, this.modify, this.room, this.http, this.persistence);

		const techCrunchAdapter = new TechCrunchAdapter();
		const techCrunchNewsSource = new NewsSource(
			this.app,
			techCrunchAdapter,
			// this.news
			news
		);
		news = await techCrunchNewsSource.fetchNews(
			this.read,
			this.modify,
			this.room,
			this.http,
			this.persistence
		);

		await techCrunchNewsSource.saveNews(this.persistence, this.persistenceRead);
	}

	public async getNewsFromSource() {
		let news: NewsItem[] = [];
		let blockBuilder = new BlockBuilder(this.app.getID());
		const elementBuilder = new ElementBuilder(this.app.getID());

		const techCrunchAdapter = new TechCrunchAdapter();
		const techCrunchNewsSource = new NewsSource(
			this.app,
			techCrunchAdapter,
			// this.news
			news
		);

		try {
			news = await techCrunchNewsSource.getNews(
				this.read,
				this.modify,
				this.room,
				this.http,
				this.persistence
			);
			console.log('fetched!!', news, 'FETCHED FROM PERSISTENCE!');

			let blocks: Block[] = [];
			for (const newsItem of news) {
				const titleBlock = blockBuilder.createSectionBlock({
					blockId: 'title-block-id',
					text: newsItem.title,
				});

				const descriptionBlock = blockBuilder.createSectionBlock({
					blockId: 'desccription-block-id',
					text: newsItem.description,
				});

				let imageElements: ImageElement[] = [];
				const image = elementBuilder.createImage({
					imageUrl: newsItem.image,
					altText: newsItem.title,
				});
				imageElements.push(image);
				const imageBlock = blockBuilder.createContextBlock({
					contextElements: imageElements,
					blockId: 'image-block-id',
				});

				blocks.push(titleBlock);
				blocks.push(descriptionBlock);
				blocks.push(imageBlock);
				// const sectionBlock = getSectionBlock('title-block-id', newsItem.title);
				// blocks.push(sectionBlock);
			}

			await sendMessage(
				this.modify,
				this.room,
				this.sender,
				'News Get From Persistenec',
				blocks
			);
		} catch (err) {
			this.app.getLogger().error(err);
			console.error(err);
		}
	}

	public async deleteNewsFromPersistence() {
		let news: NewsItem[] = [];
		const techCrunchAdapter = new TechCrunchAdapter();
		const techCrunchNewsSource = new NewsSource(
			this.app,
			techCrunchAdapter,
			news
		);

		try {
			await techCrunchNewsSource.deleteNews(
				this.read,
				this.modify,
				this.room,
				this.http,
				this.persistence
			);

			console.log('all news deleted!');
		} catch (err) {
			console.error(err);
		}
	}

	private async handleSingleParamCommand(handler: Handler) {
		const singleParamCommand = this.command[0];
		console.log(this.command);

		switch (singleParamCommand) {
			case CommandEnum.ALERT:
				await this.fetchNewsFromSource();
				break;

			case CommandEnum.GET:
				await this.getNewsFromSource();
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
			sender: this.sender,
			room: this.room,
			read: this.read,
			modify: this.modify,
			http: this.http,
			persistence: this.persistence,
			persistenceRead: this.persistenceRead,
			app: this.app,
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
