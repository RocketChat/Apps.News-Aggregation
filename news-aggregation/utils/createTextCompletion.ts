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
	prompts: { id: string; prompt: string }[]
): Promise<{ [key: string]: string }> {
	const model = await read
		.getEnvironmentReader()
		.getSettings()
		.getValueById('llm-model');

	console.log('model: ', model);

	let endpoint = ``;
	if (model === 'mistral-small-latest') {
		endpoint = `https://api.mistral.ai/v1`;
	} else if (model === 'llama3-70b') {
		endpoint = `https://api.llama-api.com`;
	} else {
		throw new Error(`Model settings doesn't exist.`);
	}
	console.log('testing1: ', model);
	console.log('promptss: ', prompts);

	const body = {
		model,
		messages: prompts.map((item) => ({
			role: 'system',
			content: item.prompt,
		})),
		temperature: 0.7,
		top_p: 1,
		max_tokens: 1000,
		stream: false,
		safe_prompt: false,
		random_seed: 1337,
	};
	console.log('testing2: ', model);
	console.log('bodaye: ', body);

	const response = await http.post(endpoint + `/chat/completions`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer uWUtKlbXTgvFt9tGXUlnMiZiFkkKCd4n`, // Add the API key here
		},
		content: JSON.stringify(body),
	});
	console.log('testing3: ', model);

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
	console.log('testing4: ', model);

	console.log('modelRes: ', response.data);
	console.log('resllm: ', response);

	const parsedResponse = JSON.parse(response?.data);
	console.log('parsed: ', parsedResponse);
	console.log('pparsed: ', parsedResponse);

	const result: { [key: string]: string } = {};
	parsedResponse.choices.forEach((choice, index) => {
		result[prompts[index].id] = choice.message.content;
	});
	console.log('resans: ', result);

	return result;
}
