import {
	IAppAccessors,
	IAppInstallationContext,
	IConfigurationExtend,
	IConfigurationModify,
	IEnvironmentRead,
	IHttp,
	ILogger,
	IModify,
	IPersistence,
	IPersistenceRead,
	IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import {
	AppMethod,
	IAppInfo,
} from '@rocket.chat/apps-engine/definition/metadata';
import { sendDirectMessageOnInstall } from './src/utils/message';
import { NewsCommand } from './src/commands/NewsCommand';
// import { IAppBuilders } from './definitions/IAppBuilders';
import { BlockBuilder } from './src/builders/BlockBuilder';
import { ElementBuilder } from './src/builders/ElementBuilder';
import { FetchNewsProcessor } from './src/processors/FetchNewsProcessor';
import {
	IUIKitInteractionHandler,
	IUIKitResponse,
	UIKitBlockInteractionContext,
	UIKitViewCloseInteractionContext,
	UIKitViewSubmitInteractionContext,
} from '@rocket.chat/apps-engine/definition/uikit';
import { ExecuteViewSubmitHandler } from './src/handlers/ExecuteViewSubmitHandler';
import { Settings } from './settings/Settings';
import { IConfig } from './definitions/IConfig';
import { ExecuteBlockActionHandler } from './src/handlers/ExecuteBlockActionHandler';
import { ExecuteViewClosedHandler } from './src/handlers/ExecuteViewClosedHandler';
import { DeliverNewsProcessor } from './src/processors/DeliverNewsProcessor';
import { UserPersistence } from './src/persistence/UserPersistence';
import { DeleteNewsProcessor } from './src/processors/DeleteNewsProcessor';
// import { ExecuteBlockActionHandler } from './handlers/ExecuteBlockActionHandler';

/**
 * Main class for the News Aggregation App, extending the base App class.
 * Manages app lifecycle events, settings, and interaction handlers.
 */
export class NewsAggregationApp extends App {
	// implements IUIKitInteractionHandler
	// Define persistence and read accessors
	persistence: IPersistence;
	persistenceRead: IPersistenceRead;
	/**
	 * Constructor for the NewsAggregationApp class.
	 * @param info - App information metadata
	 * @param logger - Logger for the app
	 * @param accessors - Accessors for app functionality
	 */
	constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
		super(info, logger, accessors);
	}

	// public async initialize(
	// 	configurationExtend: IConfigurationExtend,
	// 	environmentRead: IEnvironmentRead
	// ): Promise<void> {
	// 	// this.elementBuilder = new ElementBuilder(this.getID());
	// 	// this.blockBuilder = new BlockBuilder(this.getID());

	// 	// how to initialize persistence
	// 	// this.persistence
	// 	this.persistenceRead = this.getAccessors().reader.getPersistenceReader();
	// }

	/**
	 * Called when the app is installed.
	 * Stores user ID and sends a direct message on installation.
	 * @param context - Installation context containing user and app data
	 * @param read - Read accessor for fetching data
	 * @param http - HTTP client for external requests
	 * @param persistence - Persistence accessor for storing data
	 * @param modify - Modify accessor for changing data
	 */
	public async onInstall(
		context: IAppInstallationContext,
		read: IRead,
		http: IHttp,
		persistence: IPersistence,
		modify: IModify
	): Promise<void> {
		console.log('news app installed');

		const user = context.user;
		const userStorage = new UserPersistence(
			persistence,
			read.getPersistenceReader()
		);
		await userStorage.storeUserId(user?.id);
		console.log('userid stored');

		await sendDirectMessageOnInstall(read, modify, user, persistence);
	}

	/**
	 * Called when the app is enabled.
	 * Sets up recurring jobs for fetching, delivering, and deleting news.
	 * @param environment - Environment read accessor
	 * @param configurationModify - Configuration modify accessor
	 * @returns True if the enable process is successful
	 */
	public async onEnable(
		environment: IEnvironmentRead,
		configurationModify: IConfigurationModify
	): Promise<boolean> {
		// To fetch news periodically
		await Promise.all([
			configurationModify.scheduler.scheduleRecurring({
				id: 'fetch-news',
				interval: '* * * * *',
			}),

			configurationModify.scheduler.scheduleRecurring({
				id: 'deliver-news',
				interval: '*/20 * * * * *',
				skipImmediate: false,
				data: {
					interval: 'daily',
				},
			}),

			configurationModify.scheduler.scheduleRecurring({
				id: 'deliver-news',
				interval: '*/30 * * * * *',
				skipImmediate: false,
				data: {
					interval: 'monthly',
				},
			}),

			configurationModify.scheduler.scheduleRecurring({
				id: 'delete-news',
				interval: '*/30 * * * * *',
			}),
		]);
		return true;
	}

	/**
	 * Extends the app configuration with settings, slash commands, and processors.
	 * @param configuration - Configuration extend accessor
	 * @param environmentRead - Environment read accessor
	 */
	public async extendConfiguration(
		configuration: IConfigurationExtend,
		environmentRead: IEnvironmentRead
	): Promise<void> {
		const newsCommand: NewsCommand = new NewsCommand(this);

		await Promise.all([
			...Settings.map((setting) => {
				configuration.settings.provideSetting(setting);
			}),
		]);

		await Promise.all([
			configuration.slashCommands.provideSlashCommand(newsCommand),
		]);

		// To fetch news periodically
		await configuration.scheduler.registerProcessors([
			new FetchNewsProcessor(),
			new DeliverNewsProcessor(),
			new DeleteNewsProcessor(),
		]);
	}

	/**
	 * Called when the app is disabled.
	 * Cancels the fetch-news recurring job.
	 * @param configurationModify - Configuration modify accessor
	 */
	public async onDisable(
		configurationModify: IConfigurationModify
	): Promise<void> {
		await Promise.all([configurationModify.scheduler.cancelJob('fetch-news')]);
	}

	/**
	 * Handles UI Kit view submit interactions.
	 * @param context - Context of the view submit interaction
	 * @returns Response from the view submit handler
	 */
	public async executeViewSubmitHandler(
		context: UIKitViewSubmitInteractionContext,
		read: IRead,
		http: IHttp,
		persistence: IPersistence,
		modify: IModify
	): Promise<IUIKitResponse> {
		const handler = new ExecuteViewSubmitHandler(
			this,
			read,
			modify,
			http,
			persistence,
			context
		);
		return await handler.handleActions();
	}

	/**
	 * Handles UI Kit view close interactions.
	 * @param context - Context of the view close interaction
	 * @returns Response from the view close handler
	 */
	public async executeViewClosedHandler(
		context: UIKitViewCloseInteractionContext,
		read: IRead,
		http: IHttp,
		persistence: IPersistence,
		modify: IModify
	): Promise<IUIKitResponse> {
		const handler = new ExecuteViewClosedHandler(
			this,
			read,
			modify,
			http,
			persistence,
			context
		);
		return await handler.handleActions();
	}

	/**
	 * Handles UI Kit block action interactions.
	 * @param context - Context of the block action interaction
	 * @returns Response from the block action handler
	 */
	public async executeBlockActionHandler(
		context: UIKitBlockInteractionContext,
		read: IRead,
		http: IHttp,
		persistence: IPersistence,
		modify: IModify
	): Promise<IUIKitResponse> {
		const handler = new ExecuteBlockActionHandler(
			this,
			read,
			modify,
			http,
			persistence,
			context
		);
		return await handler.handleActions();
	}

	// public getBuilders(): IAppBuilders {
	// 	return {
	// 		elementBuilder: this.elementBuilder,
	// 		blockBuilder: this.blockBuilder,
	// 	};
	// }
}
