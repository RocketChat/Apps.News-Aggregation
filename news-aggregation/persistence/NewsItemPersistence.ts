import {
    IPersistence,
    IPersistenceRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { NewsItem } from "../definitions/NewsItem";
import {
    RocketChatAssociationModel,
    RocketChatAssociationRecord,
} from "@rocket.chat/apps-engine/definition/metadata";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { NewsAggregationApp } from "../NewsAggregationApp";

export class NewsItemPersistence {
    app: NewsAggregationApp;
    persistenceRead: IPersistenceRead;
    persistence: IPersistence;

    constructor(
        app: NewsAggregationApp,
        persistence: IPersistence,
        persistenceRead: IPersistenceRead,
    ) {
        this.app = app;
        this.persistence = persistence;
        this.persistenceRead = persistenceRead;
    }

    async saveNews(news: NewsItem, id: string) {
        const associations: Array<RocketChatAssociationRecord> = [
            new RocketChatAssociationRecord(
                RocketChatAssociationModel.MISC,
                "news-aggregation-subscribed-room",
            ),
            new RocketChatAssociationRecord(
                RocketChatAssociationModel.MISC,
                id,
            ),
        ];

        let recordId: string;
        try {
            recordId = await this.persistence.createWithAssociations(
                { newsItem: news },
                associations,
            );
            console.log("News saved!!", recordId);
        } catch (err) {
            console.error(err);
            this.app.getLogger().info(err);
        }
    }

    async deleteNews(news: NewsItem, id: string) {
        // const associations: Array<RocketChatAssociationRecord> = [];
    }
}
