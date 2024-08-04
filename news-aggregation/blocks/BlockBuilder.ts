import {
	PreviewBlockBase,
	PreviewBlockWithPreview,
	SectionBlock,
} from '@rocket.chat/ui-kit';
import { NewsItem } from '../definitions/NewsItem';

// Code to generate UI-Kit blocks (later will be replaced with Block and Element Builders)
export function getTitleBlock(labelText: string, accessory?: any) {
	const block: SectionBlock = {
		type: 'section',
		text: {
			type: 'mrkdwn',
			text: `## Title: ${labelText}`,
		},
		accessory: accessory,
	};
	return block;
}

export function getSourceBlock(labelText: string, accessory?: any) {
	const block: SectionBlock = {
		type: 'section',
		text: {
			type: 'mrkdwn',
			text: `*Source: * ${labelText}`,
		},
		accessory: accessory,
	};
	return block;
}

export function getCategoryBlock(labelText: string, accessory?: any) {
	const block: SectionBlock = {
		type: 'section',
		text: {
			type: 'mrkdwn',
			text: `*Category: * ${labelText}`,
		},
		accessory: accessory,
	};
	return block;
}

export function getPlainTextBlock(labelText: string, accessory?: any) {
	const block: SectionBlock = {
		type: 'section',
		text: {
			type: 'plain_text',
			text: labelText,
			emoji: true,
		},
		accessory: accessory,
	};
	return block;
}

export function getDescriptionBlock(labelText: string, accessory?: any) {
	const block: SectionBlock = {
		type: 'section',
		text: {
			type: 'mrkdwn',
			text: `*Summary: * ${labelText}`,
		},
		accessory: accessory,
	};
	return block;
}

export function getMarkdownBlock(labelText: string, accessory?: any) {
	const block: SectionBlock = {
		type: 'section',
		text: {
			type: 'mrkdwn',
			text: labelText,
		},
		accessory: accessory,
	};
	return block;
}

export function getOptionalsBlock(labelText?: string, accessory?: any) {
	const block: SectionBlock = {
		type: 'section',
		text: {
			type: 'mrkdwn',
			text: `### Author: ${labelText}`,
		},
		accessory: accessory,
	};
	return block;
}

export function getPreviewBlock(news: NewsItem) {
	const block: PreviewBlockBase | PreviewBlockWithPreview = {
		type: 'preview',
		title: [
			{
				type: 'plain_text',
				text: news.title,
			},
		],
		description: [
			{
				type: 'plain_text',
				text: news.description,
			},
		],
		preview: {
			url: news.image,
			dimensions: {
				width: 15,
				height: 10,
			},
		},
		externalUrl: news.link,
	};

	return block;
}

export function getChannelName(channelName: string, accessory?: any) {
	const block: SectionBlock = {
		type: 'section',
		text: {
			type: 'mrkdwn',
			text: channelName,
		},
		accessory,
	};
	return block;
}
