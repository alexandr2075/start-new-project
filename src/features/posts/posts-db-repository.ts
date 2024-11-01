import {PostViewModel} from "../../types/viewModel";
import {blogsRepository} from "../blogs/blogs-db-repository";
import {client} from "../../db/dbMongo";
import {SETTINGS} from "../../settings";

export const postsRepository = {
    async getAllPosts(): Promise<PostViewModel[]> {
        return client.db(SETTINGS.DB_NAME).collection<PostViewModel>('posts').find({}, {projection: {_id: 0}}).toArray();
    },

    async createPost(post: Partial<PostViewModel>) {
        const {title, shortDescription, content, blogId} = post;
        let blog
        if (blogId) {
            blog = await blogsRepository.getBlogById(blogId);
        }
        const newPost = {
            id: Date.now().toString(),
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog?.name,
            createdAt: new Date().toISOString(),
        }
        const insertAcknow = await client.db(SETTINGS.DB_NAME).collection<PostViewModel>('posts').insertOne(newPost);
        return await client.db(SETTINGS.DB_NAME).collection<PostViewModel>('posts').findOne({_id: insertAcknow.insertedId}, {projection: {_id: 0}})

    },

    async getPostById(id: string): Promise<PostViewModel | null> {
        return await client.db(SETTINGS.DB_NAME).collection<PostViewModel>('posts').findOne({id: id}, {projection: {_id: 0}});
    },

    async updatePostById(id: string, updatedPost: PostViewModel) {
        const result = await client.db(SETTINGS.DB_NAME).collection<PostViewModel>('posts').updateOne({id: id}, {
            $set: {
                title: updatedPost.title,
                shortDescription: updatedPost.shortDescription,
                content: updatedPost.content,
                blogId: updatedPost.blogId,
            }
        });
        return result.matchedCount === 1
    },

    async deletePostById(id: string) {
        const result = await client.db(SETTINGS.DB_NAME).collection<PostViewModel>('posts').deleteOne({id: id});
        return result.deletedCount === 1
    }
}