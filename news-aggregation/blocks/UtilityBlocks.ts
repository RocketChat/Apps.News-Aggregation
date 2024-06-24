import { Block } from '@rocket.chat/ui-kit';
import { NewsItem } from '../definitions/NewsItem';
import {
	getMarkdownBlock,
	getOptionalsBlock,
	getPlainTextBlock,
	getPreviewBlock,
	getSourceBlock,
	getTitleBlock,
} from './BlockBuilder';

export async function buildNewsBlock(news: NewsItem) {
	let blocks: Block[] = [];

	const titleBlock = getTitleBlock(news.title);
	blocks.push(titleBlock);

	const descrptionBlock = getPlainTextBlock(news.description);
	blocks.push(descrptionBlock);

	const newsPreviewBlock = getPreviewBlock(news);
	blocks.push(newsPreviewBlock);

	const sourceBlock = getSourceBlock(news.source);
	blocks.push(sourceBlock);

	const authorBlock = getOptionalsBlock(news.author);
	blocks.push(authorBlock);

	return blocks;
}
