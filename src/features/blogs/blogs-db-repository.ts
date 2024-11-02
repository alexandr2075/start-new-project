import {BlogViewModel, PostViewModel} from "../../types/viewModel";
import {client} from "../../db/dbMongo";
import {SETTINGS} from "../../settings";
import {paginationQueries} from "../../helpers/pagination-queries";
import {RequestQuery} from "../../models/queryModel";
import {ResponseModel} from "../../models/responseModel";
import {postsRepository} from "../posts/posts-db-repository";

export const blogsRepository = {
    async getAllBlogs(query: RequestQuery): Promise<ResponseModel> {
        const defaultValues = paginationQueries(query)
        const search = defaultValues.searchNameTerm
            ? {name: {$regex: defaultValues.searchNameTerm, $options: 'i'}}
            : {}

        const items = await client.db(SETTINGS.DB_NAME)
            .collection<BlogViewModel>('blogs').find(search, {projection: {_id: 0}})
            .sort(defaultValues.sortBy, defaultValues.sortDirection)
            .skip((defaultValues.pageNumber - 1) * defaultValues.pageSize)
            .limit(defaultValues.pageSize)
            .toArray()

        const totalCount = await client.db(SETTINGS.DB_NAME)
            .collection<BlogViewModel>('blogs').countDocuments(search)

        return {
            pagesCount: Math.ceil(totalCount / defaultValues.pageSize),
            page: defaultValues.pageNumber,
            pageSize: defaultValues.pageSize,
            totalCount,
            items: items
        }

    },

    async getAllPostsById(blogId: string, query: RequestQuery): Promise<ResponseModel> {
        const defaultValues = paginationQueries(query)

        const items = await client.db(SETTINGS.DB_NAME)
            .collection<PostViewModel>('posts').find({blogId: blogId}, {projection: {_id: 0}})
            .sort(defaultValues.sortBy, defaultValues.sortDirection)
            .skip((defaultValues.pageNumber - 1) * defaultValues.pageSize)
            .limit(defaultValues.pageSize)
            .toArray()
        const totalCount = await client.db(SETTINGS.DB_NAME)
            .collection<PostViewModel>('posts').countDocuments({blogId: blogId})

        return {
            pagesCount: Math.ceil(totalCount / defaultValues.pageSize),
            page: defaultValues.pageNumber,
            pageSize: defaultValues.pageSize,
            totalCount,
            items: items
        }

    },

    async createBlog(blog: Partial<BlogViewModel>) {
        const insertAcknow = await client.db(SETTINGS.DB_NAME).collection('blogs').insertOne(blog)
        return await client.db(SETTINGS.DB_NAME).collection<BlogViewModel>('blogs').findOne({_id: insertAcknow.insertedId}, {projection: {_id: 0}})
    },

    async createPostByBlogId(post: Partial<PostViewModel>) {
        return await postsRepository.createPost(post)
    },


    async getBlogById(id: string) {
        return await client.db(SETTINGS.DB_NAME).collection<BlogViewModel>('blogs').findOne({id: id}, {projection: {_id: 0}})

    },

    //get all posts for specific blog
    async getAllpostsByBlogById(id: string) {
        return await client.db(SETTINGS.DB_NAME).collection<BlogViewModel>('blogs').findOne({id: id}, {projection: {_id: 0}})

    },

    async updateBlodById(id: string, updatedBlog: BlogViewModel) {
        const result = await client.db(SETTINGS.DB_NAME).collection<BlogViewModel>('blogs').updateOne({id: id}, {
            $set: {
                name: updatedBlog.name,
                description: updatedBlog.description,
                websiteUrl: updatedBlog.websiteUrl
            }
        });
        return result.matchedCount === 1
    },

    async deleteBlogById(id: string): Promise<boolean> {
        const result = await client.db(SETTINGS.DB_NAME).collection<BlogViewModel>('blogs').deleteOne({id: id})
        return result.deletedCount === 1
    }
}