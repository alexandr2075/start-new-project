import {blogsRepository} from "../blogs/blogs-db-repository";
import {HTTP_STATUS} from "../../settings";
import {usersRepository} from "../users/users-db-repository";
import {postsRepository} from "./posts-db-repository";
import {PostInputModel, PostViewModel} from "../../models/postsModels";
import {commentsRepository} from "../comments/comments-db-repository";
import {CommentInputModel, MyStatus} from "../../models/commentModel";

export const postsService = {
//create new post
    async createPost(body: PostInputModel) {
        const {title, shortDescription, content, blogId} = body;
        const blog = await blogsRepository.getBlogById(blogId);
        if (!blog) {
            return {
                status: HTTP_STATUS.BAD_REQUEST,
                errors: [{
                    message: "blogId not found",
                    field: "blogId"
                }]
            }
        }

        const newPost: PostViewModel = {
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString(),
            extendedLikesInfo: {
                userIdWhoLiked: [],
                userIdWhoDisliked: [],
                likesCount: 0,
                dislikesCount: 0,
                myStatus: MyStatus.None,
                newestLikes: []
            }
        }
        const createdPost = await postsRepository.createPost(newPost)
        if (!createdPost) {
            return {
                status: HTTP_STATUS.NOT_FOUND,
            }
        }
        return {
            status: HTTP_STATUS.CREATED,
            data: {
                id: createdPost._id,
                title: createdPost.title,
                shortDescription: createdPost.shortDescription,
                content: createdPost.content,
                blogId: createdPost.blogId,
                blogName: createdPost.blogName,
                createdAt: createdPost.createdAt,
                extendedLikesInfo: {
                    likesCount: createdPost.extendedLikesInfo.likesCount,
                    dislikesCount: createdPost.extendedLikesInfo.dislikesCount,
                    myStatus: createdPost.extendedLikesInfo.myStatus,
                    newestLikes: createdPost.extendedLikesInfo.newestLikes
                }
            }
            // data: mapToOut(createdPost)
        }
    },

    async updatePostById(id: string, updatedPost: PostViewModel) {
        const post = await postsRepository.getPostById(id)
        if (!post) {
            return {
                status: HTTP_STATUS.NOT_FOUND
            }
        }
        const blog = await blogsRepository.getBlogById(updatedPost.blogId)
        if (!blog) {
            return {
                status: HTTP_STATUS.BAD_REQUEST,
                errors: [{
                    message: "blogId not found",
                    field: "blogId"
                }]
            }
        }
        return {
            status: HTTP_STATUS.NO_CONTENT,
            data: (await postsRepository.updatePostById(id, updatedPost))
        }
    },

    async deletePostById(id: string) {
        return await postsRepository.deletePostById(id)
    },

    async updateLikeStatusForPost(postId: string, likeStatus: string, userId: string) {
        const post = await postsRepository.getPostById(postId)
        if (!post) {
            return {
                status: HTTP_STATUS.NOT_FOUND
            }
        }

        const user = await usersRepository.getUserById(userId)
        if (!user) {
            return {
                status: HTTP_STATUS.NOT_FOUND
            }
        }
        if (!post.extendedLikesInfo.userIdWhoLiked.includes(userId)
            && likeStatus === 'Like') {
            return {
                status: HTTP_STATUS.NO_CONTENT,
                data: (await postsRepository.updateLike(postId, likeStatus, userId, user.login))
            }
        }

        if (!post.extendedLikesInfo.userIdWhoDisliked.includes(userId)
            && likeStatus === MyStatus.Dislike) {
            return {
                status: HTTP_STATUS.NO_CONTENT,
                data: (await postsRepository.updateDislike(postId, likeStatus, userId, user.login))
            }
        }

        if (likeStatus === 'None') {
            return {
                status: HTTP_STATUS.NO_CONTENT,
                data: (await postsRepository.updateNone(postId, likeStatus, userId, user.login))
            }
        }

        return {
            status: HTTP_STATUS.NO_CONTENT,
            data: post
        }
    },

    //create new comment by postId
    async createCommentByPostId(postId: string, content: string, userId: string) {

        const user = await usersRepository.getUserById(userId);
        const post = await postsRepository.getPostById(postId);
        if (!user) {
            return {
                status: HTTP_STATUS.NOT_FOUND,
            }
        }
        if (!post) {
            return {
                status: HTTP_STATUS.NOT_FOUND,
            }
        }

        const newComment: CommentInputModel = {
            content,
            commentatorInfo: {
                userId: userId,
                userLogin: user.login,
            },
            createdAt: new Date().toISOString(),
            postId,
            likesInfo: {
                userIdWhoLiked: [],
                userIdWhoDisliked: [],
                likesCount: 0,
                dislikesCount: 0,
                myStatus: MyStatus.None
            }
        }
        const result = await commentsRepository.createCommentByPostId(newComment);
        if (!result) {
            return {
                status: HTTP_STATUS.NOT_FOUND,
            }
        }
        return {
            status: HTTP_STATUS.OK,
            // data: mapToOut(result)
            data: {
                id: result._id,
                content: result.content,
                commentatorInfo: {
                    userId: result.commentatorInfo.userId,
                    userLogin: result.commentatorInfo.userLogin,
                },
                createdAt: result.createdAt,
                likesInfo: {
                    likesCount: result.likesInfo.likesCount,
                    dislikesCount: result.likesInfo.dislikesCount,
                    myStatus: result.likesInfo.myStatus,
                }
            }
        }
    },

}