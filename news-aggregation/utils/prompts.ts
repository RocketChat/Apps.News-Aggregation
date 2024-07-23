const SYSTEM_PROMPT = `I will provide you news data with id and description. Categorize the news into [\"General News\",\"Business and Finance\",\"Technology\",\"Entertainment and Celebrity News\",\"Sports\",\"Science and Environment\",\"Politics\",\"Health\",\"International\",\"Investigative Journalism\"]. Reply in json format with an object with keys as news id and value as category you assigned the respective news to. Answer format = [{id1: cat1}, {id2: cat2}]`;

export function systemPrompt() {
	return SYSTEM_PROMPT;
}

export function convertToStringifiedFormat(
	data: { id: string; prompt: string }[]
): string {
	// Map the input data to the desired format
	const formattedData = data.map((item) => ({
		id: item.id,
		description: item.prompt,
	}));

	// Convert the formatted data to a JSON string
	return JSON.stringify(formattedData);
}
