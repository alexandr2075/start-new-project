import {paginationQueriesComments} from "../../helpers/pagination-queries-comments";
import {QueryCommentsModel} from "../../models/commentModel";
import {QueryFilter} from "../../models/queryModel";
import {ResponseModel} from "../../models/responseModel";
import {paginationQueriesBlogs} from "../../helpers/pagination-queries-blogs";
import {ObjectId} from "mongodb";
import {PostModel} from "../../domains/post.entity";
import {CommentModel} from "../../domains/comment.entity";

export const postsQueryRepository = {

    async getAllPosts(query: QueryFilter): Promise<ResponseModel> {
        const defaultValues = paginationQueriesBlogs(query)

        const items = await PostModel.find({})
            .sort({[defaultValues.sortBy]: defaultValues.sortDirection})
            .skip((defaultValues.pageNumber - 1) * defaultValues.pageSize)
            .limit(defaultValues.pageSize)

        // const itemsWithId = items.map((post) => {
        //     const {_id, title, shortDescription, content, blogId, blogName, createdAt} = post
        //     return {
        //         id: _id.toString(),
        //         title,
        //         shortDescription,
        //         content,
        //         blogId, blogName,
        //         createdAt
        //     }
        // })

        const totalCount = await PostModel.countDocuments()

        return {
            pagesCount: Math.ceil(totalCount / defaultValues.pageSize),
            page: defaultValues.pageNumber,
            pageSize: defaultValues.pageSize,
            totalCount,
            items: items
        }
    },

    async getPostById(id: string) {
        return PostModel.findOne({_id: new ObjectId(id)});
        // if (!post) return null
        // return mapToOut(post)
    },

    async getAllCommentsForSpecifiedPost(query: QueryCommentsModel, postId: string, userId: string): Promise<ResponseModel> {
        const defaultValues = paginationQueriesComments(query)

        const items = await CommentModel.find({postId})
            .sort({[defaultValues.sortBy]: defaultValues.sortDirection})
            .skip((defaultValues.pageNumber - 1) * defaultValues.pageSize)
            .limit(defaultValues.pageSize)

        // const itemsWithId: CommentViewModel[] = mapArrToOutWithoutPostId(items)
        const mapItems = items.map((item) => {
            const isLiked = item.likesInfo.userIdWhoLiked.includes(userId);
            const isDisliked = item.likesInfo.userIdWhoDisliked.includes(userId);

            let myStatus: 'Like' | 'Dislike' | 'None' = 'None';
            if (isLiked) myStatus = 'Like';
            else if (isDisliked) myStatus = 'Dislike';

            return {
                id: item._id,
                content: item.content,
                commentatorInfo: {
                    userId: item.commentatorInfo.userId,
                    userLogin: item.commentatorInfo.userLogin,
                },
                createdAt: item.createdAt,
                likesInfo: {
                    likesCount: item.likesInfo.userIdWhoLiked.length,
                    dislikesCount: item.likesInfo.userIdWhoDisliked.length,
                    myStatus,
                },
            };
        })

        const totalCount = await CommentModel.countDocuments({postId})

        return {
            pagesCount: Math.ceil(totalCount / defaultValues.pageSize),
            page: defaultValues.pageNumber,
            pageSize: defaultValues.pageSize,
            totalCount,
            items: mapItems
            // items: itemsWithId
        }
    },

    // get all POSTS for a specific blog
    async getAllPostsById(blogId: string, query: QueryFilter): Promise<ResponseModel> {
        const defaultValues = paginationQueriesBlogs(query)

        const items = await PostModel.find({blogId: blogId})
            .sort({[defaultValues.sortBy]: defaultValues.sortDirection})
            .skip((defaultValues.pageNumber - 1) * defaultValues.pageSize)
            .limit(defaultValues.pageSize)

        const totalCount = await PostModel.countDocuments({blogId: blogId})

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