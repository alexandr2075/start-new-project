import {ObjectId, SortDirection} from "mongodb";

export type CommentatorInfo = {
    userId: string
    userLogin: string
}

export type CommentInputModel = {
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: string
    postId: string
    likesInfo: LikesInfo
}

export enum MyStatus {
    None = "None",
    Like = "Like",
    Dislike = "Dislike",
}

export type LikesInfo = {
    userIdWhoLiked: Array<string>,
    userIdWhoDisliked: Array<string>
    likesCount: number,
    dislikesCount: number,
    myStatus: MyStatus.None | MyStatus.Like | MyStatus.Dislike,
}

export type CommentViewModelInDB = {
    _id: ObjectId
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: string
    postId: string
}

export type CommentViewModel = {
    id: ObjectId,
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt: string,
    likesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: string
    }
}

export type CommentsViewModel = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: CommentViewModel[];
}

export type QueryCommentsModel = {
    sortBy: string,
    sortDirection: SortDirection,
    pageNumber: number;
    pageSize: number;
}