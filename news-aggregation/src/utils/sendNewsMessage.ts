import { IModify } from '@rocket.chat/apps-engine/definition/accessors';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
import { Block } from '@rocket.chat/ui-kit';

export async function sendNewsMessage(
	modify: IModify,
	room: IRoom,
	sender: IUser,
	message: string,
	blocks?: Array<Array<Block>>
): Promise<string> {
	const msg = modify
		.getCreator()
		.startMessage()
		.setSender(sender)
		.setRoom(room)
		.setParseUrls(true)
		.setText(message);

	if (blocks !== undefined) {
		for (let i = 0; i < blocks.length; i++) {
			msg.setBlocks(blocks[i]);
		}
	}

	return await modify.getCreator().finish(msg);
}
