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
import { sendDirectMessageOnInstall } from './utils/message';
import { NewsCommand } from './commands/NewsCommand';
// import { IAppBuilders } from './definitions/IAppBuilders';
import { BlockBuilder } from './builders/BlockBuilder';
import { ElementBuilder } from './builders/ElementBuilder';
import { FetchNewsProcessor } from './processors/FetchNewsProcessor';
import {
	IUIKitInteractionHandler,
	IUIKitResponse,
	UIKitBlockInteractionContext,
	UIKitViewSubmitInteractionContext,
} from '@rocket.chat/apps-engine/definition/uikit';
import { ExecuteViewSubmitHandler } from './handlers/ExecuteViewSubmitHandler';
import { Settings } from './settings/Settings';
import { IConfig } from './definitions/IConfig';
// import { ExecuteBlockActionHandler } from './handlers/ExecuteBlockActionHandler';

export class NewsAggregationApp
	extends App
	implements IUIKitInteractionHandler
{
	// implements IUIKitInteractionHandler
	config: IConfig;
	persistence: IPersistence;
	persistenceRead: IPersistenceRead;
	constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
		super(info, logger, accessors);
	}

	// public async initialize(
	// 	configurationExtend: IConfigurationExtend,
	// 	environmentRead: IEnvironmentRead
	// ): Promise<void> {
	// 	// this.elementBuilder = new ElementBuilder(this.getID());
	// 	// this.blockBuilder = new BlockBuilder(this.getID());
	// }

	public async onInstall(
		context: IAppInstallationContext,
		read: IRead,
		http: IHttp,
		persistence: IPersistence,
		modify: IModify
	): Promise<void> {
		console.log('news app installed');

		const user = context.user;
		await sendDirectMessageOnInstall(read, modify, user, persistence);
	}

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
		]);
		return true;
	}

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
			new FetchNewsProcessor(this.config),
		]);
	}

	public async onDisable(
		configurationModify: IConfigurationModify
	): Promise<void> {
		await Promise.all([configurationModify.scheduler.cancelJob('fetch-news')]);
	}

	// public async executeViewSubmitHandler(
	// 	context: UIKitViewSubmitInteractionContext,
	// 	read: IRead,
	// 	http: IHttp,
	// 	persistence: IPersistence,
	// 	modify: IModify
	// ): Promise<IUIKitResponse> {
	// 	const handler = new ExecuteViewSubmitHandler(
	// 		this,
	// 		read,
	// 		modify,
	// 		http,
	// 		persistence,
	// 		context
	// 	);
	// 	return await handler.handleActions();
	// }

	public async [AppMethod.UIKIT_VIEW_SUBMIT](
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

	// public async executeBlockActionHandler(
	// 	context: UIKitBlockInteractionContext,
	// 	read: IRead,
	// 	http: IHttp,
	// 	persistence: IPersistence,
	// 	modify: IModify
	// ): Promise<IUIKitResponse> {
	// 	const handler = new ExecuteBlockActionHandler(
	// 		this,
	// 		read,
	// 		modify,
	// 		http,
	// 		persistence,
	// 		context
	// 	);
	// 	return await handler.handleActions();
	// }

	// public getBuilders(): IAppBuilders {
	// 	return {
	// 		elementBuilder: this.elementBuilder,
	// 		blockBuilder: this.blockBuilder,
	// 	};
	// }
}
