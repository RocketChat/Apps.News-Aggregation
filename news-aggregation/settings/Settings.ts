import {
	ISetting,
	SettingType,
} from '@rocket.chat/apps-engine/definition/settings';
import { SettingEnum } from '../enums/settingEnum';

export const Settings: Array<ISetting> = [
	{
		id: SettingEnum.TECHCRUNCH,
		type: SettingType.BOOLEAN,
		packageValue: true,
		required: true,
		public: true,
		value: true,
		i18nLabel: 'TechCrunch',
		i18nDescription:
			'Setting to enable or disable the news from TechCrunch News Source',
		i18nAlert: 'Toggle to enable or disable this news source',
	},
	{
		id: SettingEnum.BBC,
		type: SettingType.BOOLEAN,
		packageValue: true,
		required: true,
		public: true,
		value: true,
		i18nLabel: 'BBC News',
		i18nDescription:
			'Setting to enable or disable the news from BBC News Source',
		i18nAlert: 'Toggle to enable or disable this news source',
	},
	{
		id: SettingEnum.ESPN,
		type: SettingType.BOOLEAN,
		packageValue: true,
		required: true,
		public: true,
		i18nLabel: 'ESPN News',
		i18nDescription:
			'Setting to enable or disable the news from ESPN News Source',
		i18nAlert: 'Toggle to enable or disable this news source',
	},
];
