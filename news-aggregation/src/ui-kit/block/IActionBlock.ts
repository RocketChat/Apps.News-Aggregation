import { ActionsBlock } from '@rocket.chat/ui-kit';

/**
 * A type that includes only the 'blockId' and 'elements' properties from the 'ActionsBlock' type.
 */
export type ActionBlockParam = Pick<ActionsBlock, 'blockId' | 'elements'>;
