import {paginationQueriesComments} from "../../helpers/pagination-queries-comments";
import {MyStatus, QueryCommentsModel} from "../../models/commentModel";
import {QueryFilter} from "../../models/queryModel";
import {ResponseModel} from "../../models/responseModel";
import {paginationQueriesBlogs} from "../../helpers/pagination-queries-blogs";
import {ObjectId, WithId} from "mongodb";
import {PostModel} from "../../domains/post.entity";
import {CommentModel} from "../../domains/comment.entity";
import {PostViewModel} from "../../models/postsModels";

export const postsQueryRepository = {

    async getAllPosts(query: QueryFilter, userId: string) {
        const defaultValues = paginationQueriesBlogs(query)

        const posts = await PostModel.find({})
            .sort({[defaultValues.sortBy]: defaultValues.sortDirection})
            .skip((defaultValues.pageNumber - 1) * defaultValues.pageSize)
            .limit(defaultValues.pageSize)

        const totalCount = await PostModel.countDocuments()

        return {
            pagesCount: Math.ceil(totalCount / defaultValues.pageSize),
            page: defaultValues.pageNumber,
            pageSize: defaultValues.pageSize,
            totalCount,
            items: posts.map(post => {
                const isLiked = post.extendedLikesInfo.userIdWhoLiked.includes(userId);
                const isDisliked = post.extendedLikesInfo.userIdWhoDisliked.includes(userId);

                let myStatus: 'Like' | 'Dislike' | 'None' = 'None';
                if (isLiked) myStatus = 'Like';
                else if (isDisliked) myStatus = 'Dislike';
                return {
                    id: post._id,
                    title: post.title,
                    shortDescription: post.shortDescription,
                    content: post.content,
                    blogId: post.blogId,
                    blogName: post.blogName,
                    createdAt: post.createdAt,
                    extendedLikesInfo: {
                        likesCount: post.extendedLikesInfo.userIdWhoLiked.length,
                        dislikesCount: post.extendedLikesInfo.userIdWhoDisliked.length,
                        myStatus,
                        newestLikes: post.extendedLikesInfo.newestLikes.slice(-3)
                            .reverse()
                            .map(p => {
                                return {
                                    addedAt: p.addedAt,
                                    login: p.login,
                                    userId: p.userId,
                                }
                            })
                    }
                }
            })
        }
    },

    async getPostById(postId: string, userId: string) {
        const post = await PostModel.findById({_id: new ObjectId(postId)}).lean();
        if (!post) {
            return null
        }
        const isLiked = post.extendedLikesInfo.userIdWhoLiked.includes(userId);
        const isDisliked = post.extendedLikesInfo.userIdWhoDisliked.includes(userId);

        let myStatus: 'Like' | 'Dislike' | 'None' = 'None';
        if (isLiked) myStatus = 'Like';
        else if (isDisliked) myStatus = 'Dislike';
        // console.log('createdPost:', createdPost);
        // return createdPost;
        return {
            id: post._id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount: post.extendedLikesInfo.userIdWhoLiked.length,
                dislikesCount: post.extendedLikesInfo.userIdWhoDisliked.length,
                myStatus,
                newestLikes: post.extendedLikesInfo.newestLikes.slice(-3)
                    .reverse()
                    .map(p => {
                        return {
                            addedAt: p.addedAt,
                            login: p.login,
                            userId: p.userId,
                        }
                    })
            }
        }
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
    async getAllPostsById(blogId: string, query: QueryFilter, userId: string) {
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
            items: items.map(post => {
                const isLiked = post.extendedLikesInfo.userIdWhoLiked.includes(userId);
                const isDisliked = post.extendedLikesInfo.userIdWhoDisliked.includes(userId);

                let myStatus: 'Like' | 'Dislike' | 'None' = 'None';
                if (isLiked) myStatus = 'Like';
                else if (isDisliked) myStatus = 'Dislike';
                return {
                    id: post._id,
                    title: post.title,
                    shortDescription: post.shortDescription,
                    content: post.content,
                    blogId: post.blogId,
                    blogName: post.blogName,
                    createdAt: post.createdAt,
                    extendedLikesInfo: {
                        likesCount: post.extendedLikesInfo.userIdWhoLiked.length,
                        dislikesCount: post.extendedLikesInfo.userIdWhoDisliked.length,
                        myStatus,
                        newestLikes: post.extendedLikesInfo.newestLikes.slice(-3)
                            .reverse()
                            .map(p => {
                                return {
                                    addedAt: p.addedAt,
                                    login: p.login,
                                    userId: p.userId,
                                }
                            })
                    }
                }
            })
        }

    },
}