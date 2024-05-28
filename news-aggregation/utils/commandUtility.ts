import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { ICommandUtility, ICommandUtilityParams } from "../definitions/ICommandUtility";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import { IHttp, IModify, IPersistence, IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { NewsAggregationApp } from "../NewsAggregationApp";

export class CommandUtility implements ICommandUtility {
    sender: IUser;
    room: IRoom;
    command: string[];
    context: SlashCommandContext;
    read: IRead;
    modify: IModify;
    http: IHttp;
    persistence: IPersistence;
    app: NewsAggregationApp;

    constructor(props: ICommandUtilityParams) {
        this.app = props.app;
        this.room = props.room;
        this.command = props.command;
        this.context = props.context;
        this.read = props.read;
        this.modify = props.modify;
        this.http = props.http;
        this.persistence = props.persistence;
        this.app = props.app;
    }

    public async resolveCommand(): Promise<void> {

    }
}
