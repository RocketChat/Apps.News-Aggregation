import {
	IAppAccessors,
	IAppInstallationContext,
	IConfigurationExtend,
	IEnvironmentRead,
	IHttp,
	ILogger,
	IModify,
	IPersistence,
	IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { sendDirectMessageOnInstall } from './utils/message';
import { NewsCommand } from './commands/NewsCommand';
import { IAppBuilders } from './definitions/IAppBuilders';
import { BlockBuilder } from './builders/BlockBuilder';
import { ElementBuilder } from './builders/ElementBuilder';

export class NewsAggregationApp extends App {
	constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
		super(info, logger, accessors);
	}

	public getBuilders(): IAppBuilders {
		const elementBuilder = new ElementBuilder(this.getID());
		const blockBuilder = new BlockBuilder(this.getID());

		return { elementBuilder, blockBuilder };
	}

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

	public async extendConfiguration(
		configuration: IConfigurationExtend,
		environmentRead: IEnvironmentRead
	): Promise<void> {
		const newsCommand: NewsCommand = new NewsCommand(this);

		await Promise.all([
			configuration.slashCommands.provideSlashCommand(newsCommand),
		]);
	}
}
