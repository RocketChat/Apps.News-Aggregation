import { ICommandUtilityParams } from './ICommandUtility';

export interface IHandler {
	subscribeNews(): Promise<void>;
}

export type IHandlerParams = Omit<ICommandUtilityParams, 'command' | 'context'>;
