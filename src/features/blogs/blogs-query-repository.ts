import {client} from "../../db/dbMongo";
import {SETTINGS} from "../../settings";
import {ObjectId} from "mongodb";
import {mapArrToOut, mapToOut} from "../../helpers/mapper";
import {BlogViewModel} from "../../models/blogsModels";
import {QueryFilter} from "../../models/queryModel";
import {ResponseModel} from "../../models/responseModel";
import {paginationQueriesBlogs} from "../../helpers/pagination-queries-blogs";
import {PostViewModel} from "../../models/postsModels";


export const blogsQueryRepository = {
    async getBlogById(id: string) {
        const blog = await client.db(SETTINGS.DB_NAME)
            .collection<BlogViewModel>('blogs').findOne({_id: new ObjectId(id)});
        if (!blog) return null
        return mapToOut(blog)
    },

    async getAllBlogs(query: QueryFilter): Promise<ResponseModel> {
        const defaultValues = paginationQueriesBlogs(query)
        const search = defaultValues.searchNameTerm
            ? {name: {$regex: defaultValues.searchNameTerm, $options: 'i'}}
            : {}

        const items = await client.db(SETTINGS.DB_NAME)
            .collection<BlogViewModel>('blogs').find(search)
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
            items: mapArrToOut(items)
        }
    },

// get all POSTS for a specific blog
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
            items: mapArrToOut(items)
        }

    },


}