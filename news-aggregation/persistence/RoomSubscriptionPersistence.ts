import {
    IPersistence,
    IPersistenceRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { NewsAggregationApp } from "../NewsAggregationApp";
import { IUser } from "@rocket.chat/apps-engine/definition/users";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import {
    RocketChatAssociationModel,
    RocketChatAssociationRecord,
} from "@rocket.chat/apps-engine/definition/metadata";
import { ISubscription } from "../definitions/ISubscription";

export class RoomSubscriptionPersistence {
    app: NewsAggregationApp;
    persistenceRead: IPersistenceRead;
    persistence: IPersistence;

    constructor(
        app: NewsAggregationApp,
        persistenceRead: IPersistenceRead,
        persistence: IPersistence,
    ) {
        this.app = app;
        this.persistenceRead = persistenceRead;
        this.persistence = persistence;
    }

    async createSubscription(interval: string, user: IUser, room: IRoom) {
        const associations: Array<RocketChatAssociationRecord> = [
            new RocketChatAssociationRecord(
                RocketChatAssociationModel.MISC,
                "news-aggregation-subscription",
            ),
            new RocketChatAssociationRecord(
                RocketChatAssociationModel.MISC,
                interval,
            ),
            new RocketChatAssociationRecord(
                RocketChatAssociationModel.USER,
                user.id,
            ),
            new RocketChatAssociationRecord(
                RocketChatAssociationModel.ROOM,
                room.id,
            ),
        ];

        let subscriptionRecord: ISubscription = {
            userId: user.id,
            interval: interval,
            createdOn: new Date(),
            user: user,
            room: room,
        };

        let subscriptionId: string;
        try {
            subscriptionId = await this.persistence.createWithAssociations(
                subscriptionRecord,
                associations,
            );
            console.log("subscription created!!", subscriptionId);
        } catch (err) {
            console.error("Could not create news subscription", err);
            this.app
                .getLogger()
                .info("Could not create news subscription", err);
        }
    }

    async getSubscribedRooms(): Promise<Array<ISubscription>> {
        const associations: Array<RocketChatAssociationRecord> = [
            new RocketChatAssociationRecord(
                RocketChatAssociationModel.MISC,
                "news-aggregation-subscription",
            ),
        ];

        let subscriptions: Array<ISubscription>;
        try {
            subscriptions = (await this.persistenceRead.readByAssociations(
                associations,
            )) as Array<ISubscription>;
        } catch (err) {
            subscriptions = [];
            console.error("Could not get subscribed rooms", err);
            this.app.getLogger().info("Could not get subscribed rooms", err);
        }

        return subscriptions;
    }
}
