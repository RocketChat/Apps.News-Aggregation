import { UIKitBlockInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import { ICommandUtilityParams } from './ICommandUtility';

/**
 * Interface representing a handler class responsible for
 * various news-related actions such as subscribing, unsubscribing,
 * fetching news on demand, and providing helper messages.
 */
export interface IHandler {
	/**
	 * Subscribes the user to news updates.
	 * @returns A promise that resolves when the subscription is complete.
	 */
	subscribeNews(): Promise<void>;

	/**
	 * Unsubscribes the user from news updates.
	 * @returns A promise that resolves when the unsubscription is complete.
	 */
	unsubscribeNews(): Promise<void>;

	/**
	 * Fetches news on demand.
	 * @returns A promise that resolves with the fetched news data.
	 */
	getNewsOnDemand(): Promise<void>;

	/**
	 * Provides a helper message with instructions or information.
	 * @returns A promise that resolves when the helper message is sent.
	 */
	helperMessage(): Promise<void>;
}

/**
 * Type representing the parameters required for a handler,
 * excluding the 'command' property from ICommandUtilityParams.
 */
export type IHandlerParams = Omit<ICommandUtilityParams, 'command'>;
