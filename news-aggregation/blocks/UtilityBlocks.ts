import { Block } from '@rocket.chat/ui-kit';
import { NewsItem } from '../definitions/NewsItem';
import {
	getCategoryBlock,
	getDescriptionBlock,
	getOptionalsBlock,
	getPreviewBlock,
	getSourceBlock,
	getTitleBlock,
} from './BlockBuilder';

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
