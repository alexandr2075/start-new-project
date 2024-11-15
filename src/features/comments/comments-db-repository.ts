import {client} from "../../db/dbMongo";
import {SETTINGS} from "../../settings";
import {CommentViewModel} from "../../models/commentModel";
import {PostViewModel} from "../../models/postsModels";

export const commentsRepository = {
    async getCommentById(commentId: string): Promise<CommentViewModel | null> {
        return await client.db(SETTINGS.DB_NAME).collection<CommentViewModel>('comments').findOne({_id: new Object(commentId)});
    },

    async updateCommentByCommentId(commentId: string, content: string) {
        const result = await client.db(SETTINGS.DB_NAME)
            .collection<CommentViewModel>('comments')
            .updateOne({_id: new Object(commentId)}, {$set: {content: content}});
        return result.matchedCount === 1
    },

    async deleteCommentByCommentId(id: string) {
        const result = await client.db(SETTINGS.DB_NAME).collection<PostViewModel>('posts').deleteOne({id: id});
        return result.deletedCount === 1
    },
}