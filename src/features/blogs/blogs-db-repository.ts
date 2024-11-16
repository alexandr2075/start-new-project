import {client} from "../../db/dbMongo";
import {SETTINGS} from "../../settings";
import {paginationQueriesBlogs} from "../../helpers/pagination-queries-blogs";
import {QueryFilter} from "../../models/queryModel";
import {ResponseModel} from "../../models/responseModel";
import {PostViewModel} from "../../models/postsModels";
import {BlogViewModel, BlogViewModelInDB} from "../../models/blogsModels";
import {ObjectId} from "mongodb";

export const blogsRepository = {

    async getAllPostsById(blogId: string, query: QueryFilter): Promise<ResponseModel> {
        const defaultValues = paginationQueriesBlogs(query)

        const items = await client.db(SETTINGS.DB_NAME)
            .collection<PostViewModel>('posts').find({blogId: blogId})
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
        return await client.db(SETTINGS.DB_NAME).collection<BlogViewModelInDB>('blogs').findOne({_id: insertAcknow.insertedId})
    },

    async getBlogById(id: string) {
        return await client.db(SETTINGS.DB_NAME).collection<BlogViewModel>('blogs').findOne({_id: new ObjectId(id)})

    },

    //get all posts for specific blog
    async getAllpostsByBlogById(id: string) {
        return await client.db(SETTINGS.DB_NAME).collection<BlogViewModel>('blogs').findOne({id: id})

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
    },

}