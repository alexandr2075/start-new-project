import {RequestAttemptDBType} from "../../models/requestModels";
import {db} from "../../db/db";

export const requestsRepository = {
    async saveRequest(attempt: RequestAttemptDBType): Promise<boolean> {
        const result = await db.getCollections().requestsCollection
            .insertOne(attempt);
        return result.acknowledged;
    },

    async countRecentAttempts(ip: string, url: string, seconds: number): Promise<number> {
        const dateFrom = new Date(new Date().getTime() - (seconds * 1000));

        return db.getCollections().requestsCollection
            .countDocuments({
                ip,
                url,
                date: {$gte: dateFrom}
            });
    }
}