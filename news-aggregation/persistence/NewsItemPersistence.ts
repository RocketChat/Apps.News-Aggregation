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

    async saveNews(news: NewsItem) {
        const associations: Array<RocketChatAssociationRecord> = [
            new RocketChatAssociationRecord(
                RocketChatAssociationModel.MISC,
                "news-aggregation",
            ),
            new RocketChatAssociationRecord(
                RocketChatAssociationModel.MISC,
                news.id,
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
            console.error("Could not save news in persistence.", err);
            this.app
                .getLogger()
                .error("Could not save news in persistence.", err);
        }
    }

    async getNewsById(news: NewsItem): Promise<object[]> {
        const associations: Array<RocketChatAssociationRecord> = [
            new RocketChatAssociationRecord(
                RocketChatAssociationModel.MISC,
                "news-aggregation",
            ),
            new RocketChatAssociationRecord(
                RocketChatAssociationModel.MISC,
                news.id,
            ),
        ];

        let newsObjectArray: object[];
        try {
            newsObjectArray =
                await this.persistenceRead.readByAssociations(associations);

            if (newsObjectArray.length === 0) {
                console.error("News with the given id doesn't exist");
                this.app
                    .getLogger()
                    .error("News with the given id doesn't exist");
            }
        } catch (err) {
            newsObjectArray = [];
            console.error("Could not get the desired news by id", err);
            this.app
                .getLogger()
                .error("Could not get the desired news by id", err);
        }

        return newsObjectArray;
    }

    async removeNewsById(news: NewsItem) {
        const associations: Array<RocketChatAssociationRecord> = [
            new RocketChatAssociationRecord(
                RocketChatAssociationModel.MISC,
                "news-aggregation",
            ),
            new RocketChatAssociationRecord(
                RocketChatAssociationModel.MISC,
                news.id,
            ),
        ];

        const newsToBeDeleted = await this.getNewsById(news);

        let removedNews: object[];
        try {
            removedNews =
                await this.persistence.removeByAssociations(associations);
        } catch (err) {
            removedNews = [];
            console.error(
                "Could not remove desired news from persistence.",
                err,
            );
            this.app
                .getLogger()
                .error("Could not remove desired news from persistence.", err);
        }
    }

    async removeAllNews() {
        const associations: Array<RocketChatAssociationRecord> = [
            new RocketChatAssociationRecord(
                RocketChatAssociationModel.MISC,
                "news-aggregation",
            ),
        ];

        try {
            await this.persistence.removeByAssociations(associations);
        } catch (err) {
            console.error("Could not remove all news from persistence.", err);
            this.app
                .getLogger()
                .error("Could not remove all news from persistence.", err);
        }
    }
}
