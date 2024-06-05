import {
	ISlashCommand,
	SlashCommandContext,
} from '@rocket.chat/apps-engine/definition/slashcommands';
import { NewsAggregationApp } from '../NewsAggregationApp';
import {
	IRead,
	IModify,
	IHttp,
	IPersistence,
} from '@rocket.chat/apps-engine/definition/accessors';
import { CommandUtility } from '../utils/commandUtility';

export class NewsCommand implements ISlashCommand {
	public constructor(private readonly app: NewsAggregationApp) {}

	public command: string = 'news';
	public i18nDescription: string = 'NewsCommandDescription';
	public i18nParamsExample: string = 'NewsCommandParams';
	public providesPreview: boolean = false;

	public async executor(
		context: SlashCommandContext,
		read: IRead,
		modify: IModify,
		http: IHttp,
		persis: IPersistence
	): Promise<void> {
		const persistenceRead = read.getPersistenceReader();
		const command = context.getArguments();
		const sender = context.getSender();
		const room = context.getRoom();
		console.log('news slash command working\n');

		console.log('command:', command);
		console.log('sender:', sender);
		console.log('room:', room);

		if (!Array.isArray(command)) {
			return;
		}

		const commandUtility = new CommandUtility({
			sender: sender,
			room: room,
			command: command,
			context: context,
			read: read,
			modify: modify,
			http: http,
			persistence: persis,
			persistenceRead: persistenceRead,
			app: this.app,
		});
		await commandUtility.resolveCommand();
	}
}
