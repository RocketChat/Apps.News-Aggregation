import { IModify, IPersistence, IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { IRoom, RoomType } from "@rocket.chat/apps-engine/definition/rooms";
import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { Block } from "@rocket.chat/ui-kit";
import { OnInstallContent } from "../enums/messageEnum";

// getDirect room creates a direct room for conversation betweeen the user and the bot.
export async function getDirectRoom(
    read: IRead,
    modify: IModify,
    appUser: IUser,
    username: string
): Promise<IRoom | undefined> {
    const usernames = [appUser.username, username];
    let room: IRoom;
    try {
        room = await read.getRoomReader().getDirectByUsernames(usernames);
    } catch (err) {
        console.error(err);
        return;
    }

    if (room) {
        return room;
    } else {
        let roomId: string;
        const newRoom = modify
            .getCreator()
            .startRoom()
            .setType(RoomType.DIRECT_MESSAGE)
            .setCreator(appUser)
            .setMembersToBeAddedByUsernames(usernames);
        roomId = await modify.getCreator().finish(newRoom);

        return await read.getRoomReader().getById(roomId);
    }
}

export async function sendDirectMessageOnInstall(
    read: IRead,
    modify: IModify,
    user: IUser,
    persistence: IPersistence,
    blocks?: Array<Block>
): Promise<string> {
    const appUser = (await read.getUserReader().getAppUser()) as IUser;
    console.log('appUser:', appUser);
    console.log('user:', user);


    const directRoom = (await getDirectRoom(read, modify, appUser, user.username)) as IRoom;


    const text = `Hey **${user.username}** ! ${OnInstallContent.WELCOME_TEXT.toString()} ${OnInstallContent.WELCOMING_MESSAGE.toString()}`;

    return await sendMessage(modify, directRoom, appUser, text);

}

export async function sendMessage(
    modify: IModify,
    room: IRoom,
    sender: IUser,
    message: string,
    blocks?: Array<Block>
): Promise<string> {
    const msg = modify
        .getCreator()
        .startMessage()
        .setSender(sender)
        .setRoom(room)
        .setParseUrls(true)
        .setText(message);

    if (blocks !== undefined) {
        msg.setBlocks(blocks);
    }

    return await modify.getCreator().finish(msg);
}
