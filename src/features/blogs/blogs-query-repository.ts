import {ObjectId} from "mongodb";
import {mapToOut} from "../../helpers/mapper";
import {QueryFilter} from "../../models/queryModel";
import {ResponseModel} from "../../models/responseModel";
import {paginationQueriesBlogs} from "../../helpers/pagination-queries-blogs";
import {BlogModel} from "../../domains/blog.entity";


export const blogsQueryRepository = {
    async getBlogById(id: string) {
        const blog = await BlogModel.findOne({_id: new ObjectId(id)});
        if (!blog) return null
        return mapToOut(blog)
    },

    async getAllBlogs(query: QueryFilter): Promise<ResponseModel> {
        const defaultValues = paginationQueriesBlogs(query)
        // const search = defaultValues.searchNameTerm
        //     ? {name: {$regex: defaultValues.searchNameTerm, $options: 'i'}}
        //     : {}
        const search = defaultValues.searchNameTerm
            ? {name: {$regex: new RegExp(defaultValues.searchNameTerm, 'i')}}
            : {};

        const items = await BlogModel.find(search)
            .sort({[defaultValues.sortBy]: defaultValues.sortDirection})
            .skip((defaultValues.pageNumber - 1) * defaultValues.pageSize)
            .limit(defaultValues.pageSize);

        // const items = await BlogModel.find(search)
        //     .sort(defaultValues.sortBy, defaultValues.sortDirection)
        //     .skip((defaultValues.pageNumber - 1) * defaultValues.pageSize)
        //     .limit(defaultValues.pageSize)
        //     .toArray()
        const totalCount = await BlogModel.countDocuments(search)

        return {
            pagesCount: Math.ceil(totalCount / defaultValues.pageSize),
            page: defaultValues.pageNumber,
            pageSize: defaultValues.pageSize,
            totalCount,
            items: items
            // items: mapArrToOut(items)
        }
    },
}