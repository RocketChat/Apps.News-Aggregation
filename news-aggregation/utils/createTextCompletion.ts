import {
	IHttp,
	IModify,
	IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { sendNotification } from './message';

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
		.getValueById('llm-model');

	let endpoint = ``;
	if (model === 'mistral-small-latest') {
		endpoint = `https://api.mistral.ai/v1`;
	} else if (model === 'llama3-70b') {
		endpoint = `https://api.llama-api.com`;
	} else {
		throw new Error(`Model settings doesn't exist.`);
	}

	const body = {
		model,
		messages: [
			{
				role: 'system',
				content: prompt,
			},
		],
		temperature: 0.7,
		top_p: 1,
		max_tokens: 1000,
		stream: false,
		safe_prompt: false,
		random_seed: 1337,
	};

	const response = await http.post(endpoint + `/chat/completions`, {
		headers: {
			'Content-Type': 'application/json',
		},
		content: JSON.stringify(body),
	});

	if (!response?.content) {
		await sendNotification(
			read,
			modify,
			user,
			room,
			'Something is wrong with the AI to classify news. Please try again.'
		);
		throw new Error(
			'Something is wrong with the AI to classify news. Please try again.'
		);
	}
	return JSON.parse(response?.content).choices[0].message.content;
}
