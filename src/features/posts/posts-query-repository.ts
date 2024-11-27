import {paginationQueriesComments} from "../../helpers/pagination-queries-comments";
import {CommentInputModel, CommentViewModel, QueryCommentsModel} from "../../models/commentModel";
import {QueryFilter} from "../../models/queryModel";
import {ResponseModel} from "../../models/responseModel";
import {paginationQueriesBlogs} from "../../helpers/pagination-queries-blogs";
import {mapArrToOut, mapArrToOutWithoutPostId, mapToOut} from "../../helpers/mapper";
import {ObjectId, WithId} from "mongodb";
import {db} from "../../db/db";

export const postsQueryRepository = {

    async getAllPosts(query: QueryFilter): Promise<ResponseModel> {
        const defaultValues = paginationQueriesBlogs(query)

        const items = await db.getCollections().postsCollection.find({})
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

        const totalCount = await db.getCollections().postsCollection.countDocuments()

        return {
            pagesCount: Math.ceil(totalCount / defaultValues.pageSize),
            page: defaultValues.pageNumber,
            pageSize: defaultValues.pageSize,
            totalCount,
            items: itemsWithId
        }
    },

    async getPostById(id: string) {
        const post = await db.getCollections().postsCollection.findOne({_id: new ObjectId(id)});
        if (!post) return null
        return mapToOut(post)
    },

    async getAllCommentsForSpecifiedPost(query: QueryCommentsModel, postId: string): Promise<ResponseModel> {
        const defaultValues = paginationQueriesComments(query)

        const items: WithId<CommentInputModel>[] = await db.getCollections().commentsCollection.find({postId})
            .sort(defaultValues.sortBy, defaultValues.sortDirection)
            .skip((defaultValues.pageNumber - 1) * defaultValues.pageSize)
            .limit(defaultValues.pageSize)
            .toArray()

        const itemsWithId: CommentViewModel[] = mapArrToOutWithoutPostId(items)
        const totalCount = await db.getCollections().commentsCollection.countDocuments({postId})

        return {
            pagesCount: Math.ceil(totalCount / defaultValues.pageSize),
            page: defaultValues.pageNumber,
            pageSize: defaultValues.pageSize,
            totalCount,
            items: itemsWithId
        }
    },

    // get all POSTS for a specific blog
    async getAllPostsById(blogId: string, query: QueryFilter): Promise<ResponseModel> {
        const defaultValues = paginationQueriesBlogs(query)

        const items = await db.getCollections().postsCollection.find({blogId: blogId})
            .sort(defaultValues.sortBy, defaultValues.sortDirection)
            .skip((defaultValues.pageNumber - 1) * defaultValues.pageSize)
            .limit(defaultValues.pageSize)
            .toArray()
        const totalCount = await db.getCollections().postsCollection.countDocuments({blogId: blogId})

        return {
            pagesCount: Math.ceil(totalCount / defaultValues.pageSize),
            page: defaultValues.pageNumber,
            pageSize: defaultValues.pageSize,
            totalCount,
            items: mapArrToOut(items)
        }

    },
}