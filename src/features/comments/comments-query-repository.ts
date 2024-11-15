import {client} from "../../db/dbMongo";
import {SETTINGS} from "../../settings";
import {CommentViewModel} from "../../models/commentModel";

export const commentsQueryRepository = {

    async getCommentById(id: string): Promise<CommentViewModel | null> {
        return await client.db(SETTINGS.DB_NAME).collection<CommentViewModel>('comments').findOne({_id: new Object(id)});
    },
}