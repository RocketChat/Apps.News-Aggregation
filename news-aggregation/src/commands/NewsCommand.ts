import {
	ISlashCommand,
	SlashCommandContext,
} from '@rocket.chat/apps-engine/definition/slashcommands';
import { NewsAggregationApp } from '../../NewsAggregationApp';
import {
	IRead,
	IModify,
	IHttp,
	IPersistence,
} from '@rocket.chat/apps-engine/definition/accessors';
import { CommandUtility } from '../utils/commandUtility';

/**
 * Handles the 'news' slash command in Rocket.Chat.
 */
export class NewsCommand implements ISlashCommand {
	public constructor(private readonly app: NewsAggregationApp) {}

	public command: string = 'news';
	public i18nDescription: string = 'NewsCommandDescription';
	public i18nParamsExample: string = 'NewsCommandParams';
	public providesPreview: boolean = false;

	/**
	 * Executes the slash command.
	 * @param context - The context of the slash command including arguments, sender, and room
	 */
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

		// Create an instance of CommandUtility with the context and accessors
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
		// Resolve the command using CommandUtility
		await commandUtility.resolveCommand();
	}
}
