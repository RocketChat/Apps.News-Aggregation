import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { NewsItem } from "../definitions/NewsItem";

export interface INewsSourceAdapter {
    fetchNews(
        read: IRead,
        modify: IModify,
        room: IRoom,
        http: IHttp,
        persis: IPersistence,
    ): Promise<any>;
}
