import {RequestAttemptDBType} from "../../models/requestModels";
import {RequestModel} from "../../domains/request.entity";

export const requestsRepository = {
    async saveRequest(attempt: RequestAttemptDBType) {
        return RequestModel
            .create(attempt);
    },

    async countRecentAttempts(ip: string, url: string, seconds: number): Promise<number> {
        const dateFrom = new Date(new Date().getTime() - (seconds * 1000));

        return RequestModel
            .countDocuments({
                ip,
                url,
                date: {$gte: dateFrom}
            });
    }
}