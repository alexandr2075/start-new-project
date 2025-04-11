import {HTTP_STATUS} from "../../settings";
import {commentsRepository} from "./comments-db-repository";
import {commentsQueryRepository} from "./comments-query-repository";

export const commentsService = {

    //get comments by id
    async getCommentById(commentId: string, userId: string) {
        const result = await commentsQueryRepository.getCommentById(commentId);
        if (!result) {
            return {
                status: HTTP_STATUS.NOT_FOUND,
            }
        }

        if (result.likesInfo.userIdWhoLiked.includes(userId)) {
            return {
                id: result._id,
                content: result.content,
                commentatorInfo: {
                    userId: result.commentatorInfo.userId,
                    userLogin: result.commentatorInfo.userLogin,
                },
                createdAt: result.createdAt,
                likesInfo: {
                    likesCount: result.likesInfo.userIdWhoLiked.length,
                    dislikesCount: result.likesInfo.userIdWhoDisliked.length,
                    myStatus: 'Like',
                }
            }
        }

        if (result.likesInfo.userIdWhoDisliked.includes(userId)) {
            return {
                id: result._id,
                content: result.content,
                commentatorInfo: {
                    userId: result.commentatorInfo.userId,
                    userLogin: result.commentatorInfo.userLogin,
                },
                createdAt: result.createdAt,
                likesInfo: {
                    likesCount: result.likesInfo.userIdWhoLiked.length,
                    dislikesCount: result.likesInfo.userIdWhoDisliked.length,
                    myStatus: 'Dislike',
                }
            }
        }

        return {
            id: result._id,
            content: result.content,
            commentatorInfo: {
                userId: result.commentatorInfo.userId,
                userLogin: result.commentatorInfo.userLogin,
            },
            createdAt: result.createdAt,
            likesInfo: {
                likesCount: result.likesInfo.userIdWhoLiked.length,
                dislikesCount: result.likesInfo.userIdWhoDisliked.length,
                myStatus: 'None',
            }
        }

    },

    async updateCommentByCommentId(commentId: string, content: string, user: string) {
        const comment = await commentsRepository.getCommentById(commentId);
        if (!comment) {
            return {
                status: HTTP_STATUS.NOT_FOUND
            }
        }
        if (comment.commentatorInfo.userId !== user) {
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

    async updateLikeStatusByCommentId(commentId: string, likeStatus: string, userIdForLikeStatus: string) {

        const comment = await commentsRepository.getCommentById(commentId);
        if (comment) {
            console.log('userId:', userIdForLikeStatus, 'l1:', comment.likesInfo.userIdWhoLiked, 'd:', comment.likesInfo.userIdWhoDisliked)
        }

        if (!comment) {
            return {
                status: HTTP_STATUS.NOT_FOUND
            }
        }

        if (!comment.likesInfo.userIdWhoLiked.includes(userIdForLikeStatus) && likeStatus === 'Like') {
            const isUpdated = await commentsRepository.updateLikeStatusByCommentId(commentId, likeStatus, userIdForLikeStatus)
            console.log('userId:', userIdForLikeStatus, 'll:', comment.likesInfo.userIdWhoLiked, 'd:', comment.likesInfo.userIdWhoDisliked)

            if (isUpdated) {
                return {
                    status: HTTP_STATUS.NO_CONTENT
                }
            }
        }

        if (!comment.likesInfo.userIdWhoDisliked.includes(userIdForLikeStatus) && likeStatus === 'Dislike') {
            const isUpdated = await commentsRepository.updateDislikeStatusByCommentId(commentId, likeStatus, userIdForLikeStatus)
            console.log('userId:', userIdForLikeStatus, 'ld:', comment.likesInfo.userIdWhoLiked, 'd:', comment.likesInfo.userIdWhoDisliked)

            if (isUpdated) {
                return {
                    status: HTTP_STATUS.NO_CONTENT
                }
            }
        }

        if (likeStatus === 'None') {
            const isUpdated = await commentsRepository.setNoneStatusByCommentId(commentId, likeStatus, userIdForLikeStatus)
            console.log('userId:', userIdForLikeStatus, 'l-none:', comment.likesInfo.userIdWhoLiked, 'd:', comment.likesInfo.userIdWhoDisliked)

            if (isUpdated) {
                return {
                    status: HTTP_STATUS.NO_CONTENT
                }
            }
        }

        if (comment.likesInfo.userIdWhoDisliked.includes(userIdForLikeStatus) && likeStatus === 'Dislike' ||
            comment.likesInfo.userIdWhoLiked.includes(userIdForLikeStatus) && likeStatus === 'Like') {
            return {
                status: HTTP_STATUS.NO_CONTENT
            }
        }

        // const isUpdated = await commentsRepository.updateLikeStatusByCommentId(commentId, likeStatus, userIdForLikeStatus)
        // if (isUpdated) {
        //     return {
        //         status: HTTP_STATUS.NO_CONTENT
        //     }
        // }
        return {
            status: HTTP_STATUS.NOT_FOUND
        }

    },

    async deleteCommentByCommentId(commentId: string, userId: string) {
        const comment = await commentsRepository.getCommentById(commentId);
        if (!comment) {
            return {
                status: HTTP_STATUS.NOT_FOUND
            }
        }
        if (comment.commentatorInfo.userId !== userId) {

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