import {SortDirection} from "mongodb";

export type QueriesForPagination = {
    pageNumber: number;
    pageSize: number;
    sortDirection: SortDirection;
    sortBy: string;
    searchNameTerm: string;
}

export const paginationQueriesBlogs = (query: any): QueriesForPagination => {
    return {
        pageNumber: query.pageNumber ? +query.pageNumber : 1,
        pageSize: query.pageSize !== undefined ? +query.pageSize : 10,
        sortBy: query.sortBy ? query.sortBy : 'createdAt',
        sortDirection: query.sortDirection ? query.sortDirection as SortDirection : 'desc',
        searchNameTerm: query.searchNameTerm ? query.searchNameTerm : null,
    }
}