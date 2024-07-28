import {
	IHttp,
	IModify,
	IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { sendNotification } from './message';
import {
	convertToStringifiedFormat,
	systemPrompt,
	techCrunchSystemPrompt,
} from './prompts';

export async function createTextCompletion(
	read: IRead,
	room: IRoom,
	user: IUser,
	modify: IModify,
	http: IHttp,
	prompts: { id: string; prompt: string }[] | string[]
): Promise<{ [key: string]: string }[] | []> {
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
	// console.log('promptss: ', prompts);

	// prompts.map((item) => {
	// 		const categoryPrompt = newsCategoryPrompt(item.prompt);
	// 		return {
	// 			role: 'user',
	// 			content: categoryPrompt,
	// 		};
	// 	})

	console.log('incomingprompot: ', prompts);

	let stringifiedPrompt = '';
	if (typeof prompts === 'object' && !Array.isArray(prompts)) {
		stringifiedPrompt = convertToStringifiedFormat(prompts);
		console.log('strifiedPrompt: ', stringifiedPrompt);
	} else if (
		Array.isArray(prompts)
		// prompts.every((item: any) => typeof item === 'string')
	) {
		stringifiedPrompt = prompts
			.map((prompt) => JSON.stringify(prompt))
			.join(' ');
	}
	console.log('stringifyfyis: ', stringifiedPrompt);
	console.log('isarray?', Array.isArray(prompts));

	const body = {
		model,
		messages: [
			{
				role: 'system',
				content: !Array.isArray(prompts)
					? techCrunchSystemPrompt()
					: systemPrompt(),
			},
			{
				role: 'user',
				content: stringifiedPrompt,
			},
		],
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

	const parsedResponse = JSON.parse(response?.content);
	console.log('parsed: ', parsedResponse);

	// const resultObject: { [key: string]: string } = parsedResponse?.choices.map(
	// 	(choice: any, index: number) => {
	// 		return choice.message.content.trim();
	// 	}
	// );
	const resultObject = parsedResponse?.choices[0].message.content.trim();
	console.log('resansss: ', resultObject);

	// const result = Object.entries(resultObject).map(([key, value]) => ({
	// 	[key]: value,
	// }));
	// console.log('obj:', Object.entries(resultObject));

	// type KeyValuePair = { [key: string]: string };

	// const result: KeyValuePair[] = Object.entries(resultObject).map(
	// 	([key, value]) => ({ [key]: value })
	// );

	// return result;
	return resultObject;
}
