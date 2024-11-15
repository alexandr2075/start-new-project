import {SortDirection} from "mongodb";
import {IdType} from "../types/id";

export type CommentatorInfo = {
    userId: IdType
    userLogin: string
}

export type CommentInputModel = {
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: string
}

export type CommentViewModelInDB = {
    _id: string
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: string
}

export type CommentViewModel = {
    id: string
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: string
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