import {CommentInputModel} from "../../models/commentModel";
import {ObjectId} from "mongodb";
import {mapToOut} from "../../helpers/mapper";
import {db} from "../../db/db";

export const commentsRepository = {

    async getCommentById(id: string) {
        const result = await db.getCollections().commentsCollection.findOne({_id: new ObjectId(id)})
        if (result) return mapToOut(result)

    },

    async updateCommentByCommentId(commentId: string, content: string) {
        const result = await db.getCollections().commentsCollection
            .updateOne({_id: new ObjectId(commentId)}, {$set: {content: content}});
        return result.matchedCount === 1
    },

    async deleteCommentByCommentId(id: string) {
        const result = await db.getCollections().commentsCollection.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount === 1
    },

    async createCommentByPostId(newComment: CommentInputModel) {
        const insertAcknow = await db.getCollections().commentsCollection.insertOne(newComment);
        return await db.getCollections().commentsCollection.findOne({_id: new Object(insertAcknow.insertedId)})

    },


}