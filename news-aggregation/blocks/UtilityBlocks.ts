import { Block } from '@rocket.chat/ui-kit';
import { NewsItem } from '../definitions/NewsItem';
import {
	getCategoryBlock,
	getChannelName,
	getDescriptionBlock,
	getOptionalsBlock,
	getPreviewBlock,
	getSourceBlock,
	getTitleBlock,
} from './BlockBuilder';

// Code to build a news item block
export async function buildNewsBlock(news: NewsItem) {
	let blocks: Block[] = [];

	const titleBlock = getTitleBlock(news.title);
	blocks.push(titleBlock);

	const descriptionBlock = getDescriptionBlock(news.description);
	blocks.push(descriptionBlock);

	const newsPreviewBlock = getPreviewBlock(news);
	blocks.push(newsPreviewBlock);

	const sourceBlock = getSourceBlock(news.source);
	blocks.push(sourceBlock);

	if (news.category) {
		const categoryBlock = getCategoryBlock(news.category);
		blocks.push(categoryBlock);
	}

	if (news.author != 'NA') {
		const authorBlock = getOptionalsBlock(news.author);
		blocks.push(authorBlock);
	}

	return blocks;
}

// Code to display all subscribed rooms as list
export async function getSubscribedRoom(roomName: string) {
	let blocks: Block[] = [];

	const roomNameBlock = getChannelName(roomName);
	blocks.push(roomNameBlock);

	return blocks;
}
