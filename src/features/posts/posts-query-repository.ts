import {client} from "../../db/dbMongo";
import {SETTINGS} from "../../settings";
import {paginationQueriesComments} from "../../helpers/pagination-queries-comments";
import {CommentViewModel, QueryCommentsModel} from "../../models/commentModel";
import {QueryFilter} from "../../models/queryModel";
import {ResponseModel} from "../../models/responseModel";
import {paginationQueriesBlogs} from "../../helpers/pagination-queries-blogs";
import {PostViewModel} from "../../models/postsModels";

export const postsQueryRepository = {

    async getAllPosts(query: QueryFilter): Promise<ResponseModel> {
        const defaultValues = paginationQueriesBlogs(query)

        const items = await client.db(SETTINGS.DB_NAME)
            .collection<PostViewModel>('posts').find({})
            .sort(defaultValues.sortBy, defaultValues.sortDirection)
            .skip((defaultValues.pageNumber - 1) * defaultValues.pageSize)
            .limit(defaultValues.pageSize)
            .toArray()

        const itemsWithId = items.map((post) => {
            const {_id, title, shortDescription, content, blogId, blogName, createdAt} = post
            return {
                id: _id.toString(),
                title,
                shortDescription,
                content,
                blogId, blogName,
                createdAt
            }
        })

        const totalCount = await client.db(SETTINGS.DB_NAME)
            .collection<PostViewModel>('posts').countDocuments()

        return {
            pagesCount: Math.ceil(totalCount / defaultValues.pageSize),
            page: defaultValues.pageNumber,
            pageSize: defaultValues.pageSize,
            totalCount,
            items: itemsWithId
        }
    },

    async getAllCommentsForSpecifiedPost(query: QueryCommentsModel) {
        const defaultValues = paginationQueriesComments(query)

        const items = await client.db(SETTINGS.DB_NAME)
            .collection<CommentViewModel>('comments').find()
            .sort(defaultValues.sortBy, defaultValues.sortDirection)
            .skip((defaultValues.pageNumber - 1) * defaultValues.pageSize)
            .limit(defaultValues.pageSize)
            .toArray()

        const itemsWithId = items.map((com) => {
            const {_id, content, commentatorInfo, createdAt} = com
            return {
                id: _id.toString(),
                content,
                commentatorInfo,
                createdAt
            }
        })
        const totalCount = await client.db(SETTINGS.DB_NAME)
            .collection<CommentViewModel>('comments').countDocuments()

        return {
            pagesCount: Math.ceil(totalCount / defaultValues.pageSize),
            page: defaultValues.pageNumber,
            pageSize: defaultValues.pageSize,
            totalCount,
            items: itemsWithId
        }
    }
}