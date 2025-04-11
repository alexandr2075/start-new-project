import {CommentInputModel} from "../../models/commentModel";
import {ObjectId} from "mongodb";
import {CommentModel} from "../../domains/comment.entity";

export const commentsRepository = {

    async getCommentById(id: string) {
        return CommentModel.findById(id)
        // if (result) return mapToOut(result)

    },

    async updateCommentByCommentId(commentId: string, content: string) {
        const result = await CommentModel
            .updateOne({_id: new ObjectId(commentId)}, {$set: {content: content}});
        return result.matchedCount === 1
    },

    async updateLikeStatusByCommentId(commentId: string, likeStatus: string, userIdForLikeStatus: string) {
        const result = await Promise.all([
            CommentModel
                .updateOne({_id: new ObjectId(commentId)}, {$pull: {'likesInfo.userIdWhoDisliked': userIdForLikeStatus}}),
            CommentModel
                .updateOne({_id: new ObjectId(commentId)}, {$push: {'likesInfo.userIdWhoLiked': userIdForLikeStatus}})
        ])
        const modifiedCount = result[0].modifiedCount + result[1].modifiedCount;
        return modifiedCount > 0;
    },

    async updateDislikeStatusByCommentId(commentId: string, likeStatus: string, userIdForLikeStatus: string) {
        const result = await Promise.all([
            CommentModel
                .updateOne({_id: new ObjectId(commentId)}, {$pull: {'likesInfo.userIdWhoLiked': userIdForLikeStatus}}),
            CommentModel
                .updateOne({_id: new ObjectId(commentId)}, {$push: {'likesInfo.userIdWhoDisliked': userIdForLikeStatus}})
        ])
        const modifiedCount = result[0].modifiedCount + result[1].modifiedCount;
        return modifiedCount > 0;
    },

    async setNoneStatusByCommentId(commentId: string, likeStatus: string, userIdForLikeStatus: string) {
        const result = await Promise.all([
            CommentModel.updateOne(
                {_id: new ObjectId(commentId)},
                {$pull: {'likesInfo.userIdWhoLiked': userIdForLikeStatus}}
            ),
            CommentModel.updateOne(
                {_id: new ObjectId(commentId)},
                {$pull: {'likesInfo.userIdWhoDisliked': userIdForLikeStatus}}
            )
        ]);
        const modifiedCount = result[0].modifiedCount + result[1].modifiedCount;
        return modifiedCount > 0;
    },

    async deleteCommentByCommentId(id: string) {
        const result = await CommentModel.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount === 1
    },

    async createCommentByPostId(newComment: CommentInputModel) {
        return CommentModel.create(newComment);
    },


}