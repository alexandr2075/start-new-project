import {blogsRepository} from "../blogs/blogs-db-repository";
import {client} from "../../db/dbMongo";
import {HTTP_STATUS, SETTINGS} from "../../settings";
import {usersRepository} from "../users/users-db-repository";
import {postsRepository} from "./posts-db-repository";
import {PostInputModel, PostViewModel} from "../../models/postsModels";
import {mapToOut} from "../../helpers/mapper";
import {ObjectId} from "mongodb";

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

        const newPost = {
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString(),
        }
        const createdPost = await postsRepository.createPost(newPost)
        if (!createdPost) {
            return {
                status: HTTP_STATUS.NOT_FOUND,
            }
        }
        return {
            status: HTTP_STATUS.CREATED,
            data: mapToOut(createdPost)
        }
    },

    async updatePostById(id: string, updatedPost: PostViewModel) {
        if (!ObjectId.isValid(id)) {
            return {
                status: HTTP_STATUS.NOT_FOUND
            }
        }
        const post = await postsRepository.getPostById(id)
        console.log('post', post)
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
        const result = await client.db(SETTINGS.DB_NAME).collection<PostViewModel>('posts').deleteOne({id: id});
        return result.deletedCount === 1
    },

    //create new comment by postId
    async createCommentByPostId(postId: string, content: string, userId: any) {
        const user = await usersRepository.getUserById(userId);
        const post = await postsRepository.getPostById(postId);
        if (!user) return null
        if (!post) return null

        const newComment = {
            content,
            commentatorInfo: {
                userId: userId.id,
                userLogin: user.login,
            },
            createdAt: new Date().toISOString(),
        }
        const result = await postsRepository.createCommentByPostId(newComment);
        if (!result) return null
        return mapToOut(result)
    },

}