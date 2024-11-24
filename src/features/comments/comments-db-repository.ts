import {client} from "../../db/dbMongo";
import {SETTINGS} from "../../settings";
import {CommentViewModel, CommentViewModelInDB} from "../../models/commentModel";
import {PostViewModel} from "../../models/postsModels";
import {ObjectId} from "mongodb";
import {mapToOut} from "../../helpers/mapper";

export const commentsRepository = {

    async getCommentById(id: string) {
        const result = await client.db(SETTINGS.DB_NAME).collection<CommentViewModelInDB>('comments').findOne({_id: new ObjectId(id)})
        if (result) return mapToOut(result)

    },

    async updateCommentByCommentId(commentId: string, content: string) {
        const result = await client.db(SETTINGS.DB_NAME)
            .collection<CommentViewModel>('comments')
            .updateOne({_id: new ObjectId(commentId)}, {$set: {content: content}});
        return result.matchedCount === 1
    },

    async deleteCommentByCommentId(id: string) {
        const result = await client.db(SETTINGS.DB_NAME).collection<CommentViewModelInDB>('comments').deleteOne({_id: new ObjectId(id)});
        return result.deletedCount === 1
    },
}