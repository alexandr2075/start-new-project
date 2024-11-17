import {client} from "../../db/dbMongo";
import {SETTINGS} from "../../settings";
import {CommentViewModel} from "../../models/commentModel";
import {PostViewModel} from "../../models/postsModels";

export const commentsRepository = {
    async getCommentById(commentId: string): Promise<CommentViewModel | null> {
        console.log('commentid', commentId);
        return await client.db(SETTINGS.DB_NAME).collection<CommentViewModel>('comments').findOne({_id: new Object(commentId)});
    },

    async updateCommentByCommentId(commentId: string, content: string) {
        const result = await client.db(SETTINGS.DB_NAME)
            .collection<CommentViewModel>('comments')
            .updateOne({_id: new Object(commentId)}, {$set: {content: content}});
        return result.matchedCount === 1
    },

    async deleteCommentByCommentId(id: string) {
        const result = await client.db(SETTINGS.DB_NAME).collection<PostViewModel>('posts').deleteOne({_id: new Object(id)});
        console.log('result', result);
        return result.deletedCount === 1
    },
}