import {client} from "../../db/dbMongo";
import {SETTINGS} from "../../settings";
import {CommentViewModelInDB} from "../../models/commentModel";
import {ObjectId} from "mongodb";
import {mapToOut} from "../../helpers/mapper";

export const commentsQueryRepository = {

    async getCommentById(id: string): Promise<CommentViewModelInDB | null> {
        return client.db(SETTINGS.DB_NAME).collection<CommentViewModelInDB>('comments').findOne({_id: new ObjectId(id)})
            .then(createdComment => {
                if (createdComment) return mapToOut(createdComment)
                return createdComment
            });
    },
}