import { UIKitBlockInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import { ICommandUtilityParams } from './ICommandUtility';

export interface IHandler {
	subscribeNews(): Promise<void>;
	unsubscribeNews(): Promise<void>;
	getNewsOnDemand(): Promise<void>;
	helperMessage(): Promise<void>;
}

export type IHandlerParams = Omit<ICommandUtilityParams, 'command'>;
