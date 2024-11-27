import {ObjectId} from "mongodb";
import {mapArrToOut, mapToOut} from "../../helpers/mapper";
import {QueryFilter} from "../../models/queryModel";
import {ResponseModel} from "../../models/responseModel";
import {paginationQueriesBlogs} from "../../helpers/pagination-queries-blogs";
import {db} from "../../db/db";


export const blogsQueryRepository = {
    async getBlogById(id: string) {
        const blog = await db.getCollections().blogsCollection.findOne({_id: new ObjectId(id)});
        if (!blog) return null
        return mapToOut(blog)
    },

    async getAllBlogs(query: QueryFilter): Promise<ResponseModel> {
        const defaultValues = paginationQueriesBlogs(query)
        const search = defaultValues.searchNameTerm
            ? {name: {$regex: defaultValues.searchNameTerm, $options: 'i'}}
            : {}

        const items = await db.getCollections().blogsCollection.find(search)
            .sort(defaultValues.sortBy, defaultValues.sortDirection)
            .skip((defaultValues.pageNumber - 1) * defaultValues.pageSize)
            .limit(defaultValues.pageSize)
            .toArray()
        const totalCount = await db.getCollections().blogsCollection.countDocuments(search)

        return {
            pagesCount: Math.ceil(totalCount / defaultValues.pageSize),
            page: defaultValues.pageNumber,
            pageSize: defaultValues.pageSize,
            totalCount,
            items: mapArrToOut(items)
        }
    },
}