import {PostViewModel} from "../../types/viewModel";
import {blogsRepository} from "../blogs/blogs-db-repository";
import {client} from "../../db/dbMongo";
import {SETTINGS} from "../../settings";
import {paginationQueries} from "../../helpers/pagination-queries";
import {RequestQuery} from "../../models/queryModel";
import {ResponseModel} from "../../models/responseModel";

export const postsRepository = {
    async getAllPosts(query: RequestQuery): Promise<ResponseModel> {
        const defaultValues = paginationQueries(query)

        const items = await client.db(SETTINGS.DB_NAME)
            .collection<PostViewModel>('posts').find({}, {projection: {_id: 0}})
            .sort(defaultValues.sortBy, defaultValues.sortDirection)
            .skip((defaultValues.pageNumber - 1) * defaultValues.pageSize)
            .limit(defaultValues.pageSize)
            .toArray()

        const totalCount = await client.db(SETTINGS.DB_NAME)
            .collection<PostViewModel>('posts').countDocuments()

        return {
            pagesCount: Math.ceil(totalCount / defaultValues.pageSize),
            page: defaultValues.pageNumber,
            pageSize: defaultValues.pageSize,
            totalCount,
            items: items
        }
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