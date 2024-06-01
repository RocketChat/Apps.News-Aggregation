import {
    IRead,
    IModify,
    IHttp,
    IPersistence,
} from "@rocket.chat/apps-engine/definition/accessors";
import { NewsAggregationApp } from "../NewsAggregationApp";
import { NewsItem } from "../definitions/NewsItem";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { createNewsSource } from "../definitions/NewsSource";

const NewsSource = createNewsSource();
export class TechCrunchNewsSource extends NewsSource {
    app: NewsAggregationApp;
    newsItems: NewsItem[] = [];
    fetchUrl: string = `https://techcrunch.com/wp-json/wp/v2/posts`;

    constructor(app: NewsAggregationApp, news: NewsItem[]) {
        // this.app = app;
        // this.newsItems = news;
        super(app, news);
    }

    public async fetchNews(
        read: IRead,
        modify: IModify,
        room: IRoom,
        http: IHttp,
        persis: IPersistence
    ): Promise<any> {
        try {
            const response = await http.get(this.fetchUrl);

            console.log("Res:", response.data, "Done");

            this.newsItems = response?.data?.map((newsItem) => ({
                title: newsItem.yoast_head_json.title,
                description: newsItem.yoast_head_json.description,
                link: newsItem.link,
                image: newsItem.jetpack_featured_media_url,
                source: "TechCrunch",
                author: newsItem.yoast_head_json.author,
                publishedAt: new Date(newsItem.date).toISOString(),
            }));
            console.log('NewsItems:', this.newsItems);
        } catch (err) {
            console.error(err); // for development purposes
            this.app.getLogger().info(err);
        }

        return this.newsItems;
    }
}
