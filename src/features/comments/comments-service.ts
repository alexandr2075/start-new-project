import {HTTP_STATUS} from "../../settings";
import {IdType} from "../../types/id";
import {commentsRepository} from "./comments-db-repository";

export const commentsService = {

    async updateCommentByCommentId(commentId: string, content: string, user: IdType) {
        const comment = await commentsRepository.getCommentById(commentId);
        if (!comment) {
            return {
                status: HTTP_STATUS.NOT_FOUND
            }
        }
        if (comment.commentatorInfo.userId !== user.id) {
            return {
                status: HTTP_STATUS.FORBIDDEN
            }
        }
        const isUpdated = await commentsRepository.updateCommentByCommentId(commentId, content)
        if (isUpdated) {
            return {
                status: HTTP_STATUS.NO_CONTENT
            }
        }
        return null

    },

    async deleteCommentByCommentId(commentId: string, user: IdType) {
        const comment = await commentsRepository.getCommentById(commentId);
        if (!comment) {
            return {
                status: HTTP_STATUS.NOT_FOUND
            }
        }
        if (comment.commentatorInfo.userId !== user.id) {
            console.log('forb')
            return {
                status: HTTP_STATUS.FORBIDDEN
            }
        }
        const isDeleted = await commentsRepository.deleteCommentByCommentId(commentId);
        if (isDeleted) {
            return {
                status: HTTP_STATUS.NO_CONTENT
            }
        }
        return null
    },
}