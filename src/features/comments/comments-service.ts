import {HTTP_STATUS} from "../../settings";
import {IdType} from "../../types/id";
import {commentsRepository} from "./comments-db-repository";

export const commentsService = {

    async updateCommentByCommentId(commentId: string, content: string, userId: IdType) {
        const comment = await commentsRepository.getCommentById(commentId);
        if (!comment) return null;
        if (comment.commentatorInfo.userId === userId) {
            return {
                status: HTTP_STATUS.FORBIDDEN
            }
        }
        return commentsRepository.updateCommentByCommentId(commentId, content)

    },

    async deleteCommentByCommentId(commentId: string, userId: IdType) {
        const comment = await commentsRepository.getCommentById(commentId);
        console.log('comment', comment);
        if (!comment) return null;
        if (comment.commentatorInfo.userId !== userId) {
            return {
                status: HTTP_STATUS.FORBIDDEN
            }
        }
        return commentsRepository.deleteCommentByCommentId(commentId);
    },
}