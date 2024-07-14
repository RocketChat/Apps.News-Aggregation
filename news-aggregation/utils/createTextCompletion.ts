import {
	IHttp,
	IModify,
	IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';

export async function createTextCompletion(
	read: IRead,
	room: IRoom,
	user: IUser,
	modify: IModify,
	http: IHttp,
	prompt: string
): Promise<string> {
	const model = await read
		.getEnvironmentReader()
		.getSettings()
		.getById('llm-model');
	const model2 = await read
		.getEnvironmentReader()
		.getSettings()
		.getValueById('llm-model');

	console.log(model + '---' + model2);
	return '';
}
