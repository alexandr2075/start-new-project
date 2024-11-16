import {blogsRepository} from "../blogs/blogs-db-repository";
import {client} from "../../db/dbMongo";
import {HTTP_STATUS, SETTINGS} from "../../settings";
import {usersRepository} from "../users/users-db-repository";
import {postsRepository} from "./posts-db-repository";
import {PostInputModel, PostViewModel} from "../../models/postsModels";
import {mapToOut} from "../../helpers/mapper";
import {BlogViewModel} from "../../models/blogsModels";
import {ObjectId} from "mongodb";

export const postsService = {
//create new post
    async createPost(body: PostInputModel) {
        const {title, shortDescription, content, blogId} = body;
        const blog = await blogsRepository.getBlogById(blogId);
        if (!blog) return null

        const newPost = {
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString(),
        }
        const createdUser = await postsRepository.createPost(newPost)
        if (!createdUser) return null
        return mapToOut(createdUser)
    },

    async updatePostById(id: string, updatedPost: PostViewModel) {
        const blog = await client.db(SETTINGS.DB_NAME)
            .collection<BlogViewModel>('blogs').findOne({_id: new ObjectId(updatedPost.blogId)});
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
                userId: userId,
                userLogin: user.login,
            },
            createdAt: new Date().toISOString(),
        }
        return await postsRepository.createCommentByPostId(newComment);
    },

}