import {SortDirection} from "mongodb";
import {LikesInfo, MyStatus} from "./commentModel";
import {Schema} from "mongoose";

export type QueryPostModel = {
    sortBy: string,
    sortDirection: SortDirection,
    pageNumber: number;
    pageSize: number;
}

export type LikeDetailsViewModel = {
    addedAt: Date,
    userId: string,
    login: string,
}

export type ExtendedLikesInfoViewModel = {
    likesCount: number,
    dislikesCount: number,
    myStatus: MyStatus.None | MyStatus.Like | MyStatus.Dislike,
    newestLikes: LikeDetailsViewModel[]
}

export type LikesInfoViewModel = {
    userIdWhoLiked: [],
    userIdWhoDisliked: [],
    likesCount: Number,
    dislikesCount: Number,
    myStatus: String,
    newestLikes: []
}

export type PostViewModel = {
    _id?: string,
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
    extendedLikesInfo: LikesInfoViewModel
}

export type PostViewModelWithId = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string | undefined;
    createdAt: string;
}

export type PostsViewModel = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: PostViewModel[];
}

export type PostInputModel = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
}


