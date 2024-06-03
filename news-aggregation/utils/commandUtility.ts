import { IUser } from "@rocket.chat/apps-engine/definition/users";
import {
    ICommandUtility,
    ICommandUtilityParams,
} from "../definitions/ICommandUtility";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { NewsAggregationApp } from "../NewsAggregationApp";
import { CommandEnum } from "../enums/commandEnum";
import { sendHelperMessage } from "./message";
import { TechCrunchAdapter } from "../adapters/source-adapters/TechCrunchAdapter";
import { NewsItem } from "../definitions/NewsItem";
import { NewsSource } from "../definitions/NewsSource";

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
        this.sender = props.sender;
        this.room = props.room;
        this.command = props.command;
        this.context = props.context;
        this.read = props.read;
        this.modify = props.modify;
        this.http = props.http;
        this.persistence = props.persistence;
        this.app = props.app;
    }

    private async helperMessage() {
        await sendHelperMessage(
            this.room,
            this.read,
            this.modify,
            this.sender,
            this.http,
            this.persistence,
        );
    }

    private async fetchNewsFromSource() {
        const news: NewsItem[] = [];
        // const techCrunchSource = new TechCrunchNewsSource(this.app, news);
        // await techCrunchSource.fetchNews(this.read, this.modify, this.room, this.http, this.persistence);

        const techCrunchAdapter = new TechCrunchAdapter();
        const techCrunchNewsSource = new NewsSource(
            this.app,
            techCrunchAdapter,
            news,
        );
        await techCrunchNewsSource.fetchNews(
            this.read,
            this.modify,
            this.room,
            this.http,
            this.persistence,
        );
    }

    // public async getNewsFromSource() {
    //     const news: NewsItem[] = [];
    //     const techCrunchSource = new TechCrunchNewsSource(this.app, news);
    //     await techCrunchSource.
    // }

    public async resolveCommand(): Promise<void> {
        switch (this.command[0]) {
            case CommandEnum.ALERT:
                await this.fetchNewsFromSource();

            case CommandEnum.HELP:
            default:
                await this.helperMessage();
                break;
        }
    }
}
