import {SortDirection} from "mongodb";

export type BlogViewModel = {
    id: string;
    name: string | undefined;
    description: string | undefined;
    websiteUrl: string | undefined;
    createdAt: string;
    isMembership: boolean;
}


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
    blogName: string | undefined;
    createdAt: string;
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


