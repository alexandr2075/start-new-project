import {SortDirection} from "mongodb";

export type QueryPostModel = {
    sortBy: string,
    sortDirection: SortDirection,
    pageNumber: number;
    pageSize: number;
}

export type PostViewModel = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: Date;
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


