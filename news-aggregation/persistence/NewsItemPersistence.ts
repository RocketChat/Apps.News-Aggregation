import {
    IPersistence,
    IPersistenceRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { NewsItem } from "../definitions/NewsItem";

export class NewsItemPersistence {
    persistenceRead: IPersistenceRead;
    persistence: IPersistence;

    constructor(persistence: IPersistence, persistenceRead: IPersistenceRead) {
        this.persistence = persistence;
        this.persistenceRead = persistenceRead;
    }

    async saveNews(news: NewsItem, id: string) {}

    async deleteNews(news: NewsItem, id: string) {}
}
