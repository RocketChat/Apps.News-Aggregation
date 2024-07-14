import {
	ISetting,
	SettingType,
} from '@rocket.chat/apps-engine/definition/settings';
import { SettingEnum } from '../enums/settingEnum';

export const Settings: Array<ISetting> = [
	{
		// id: SettingEnum.TECHCRUNCH,
		id: 'techcrunch',
		type: SettingType.BOOLEAN,
		i18nLabel: 'TechCrunch',
		i18nDescription:
			'Setting to enable or disable the news from TechCrunch News Source',
		i18nAlert: 'Toggle to enable or disable this news source',
		packageValue: true,
		required: true,
		public: true,
		value: true,
	},
	{
		// id: SettingEnum.BBC,
		id: 'bbc',
		type: SettingType.BOOLEAN,
		i18nLabel: 'BBC News',
		i18nDescription:
			'Setting to enable or disable the news from BBC News Source',
		i18nAlert: 'Toggle to enable or disable this news source',
		packageValue: true,
		required: true,
		public: true,
		value: true,
	},
	{
		// id: SettingEnum.ESPN,
		id: 'espn',
		type: SettingType.BOOLEAN,
		i18nLabel: 'ESPN News',
		i18nDescription:
			'Setting to enable or disable the news from ESPN News Source',
		i18nAlert: 'Toggle to enable or disable this news source',
		packageValue: true,
		required: true,
		public: true,
	},
	{
		id: 'llm-model',
		type: SettingType.SELECT,
		i18nLabel: 'Model Selection',
		i18nDescription: 'AI model to use for news classification',
		values: [
			{ key: 'mistral-small-latest', i18nLabel: 'Mistral Small' },
			{ key: 'llama3-70b', i18nLabel: 'Llama3 70B' },
		],
		packageValue: 'mistral-small-latest',
		public: true,
		required: true,
	},
	{
		id: 'mistral-api-key',
		type: SettingType.STRING,
		i18nLabel: 'Mistral API Key',
		i18nDescription: 'The API Key to use mistral',
		i18nPlaceholder: 'Enter Mistral API Key to classify news',
		value: '',
		packageValue: '',
		public: false,
		hidden: false,
		required: true,
	},
];
