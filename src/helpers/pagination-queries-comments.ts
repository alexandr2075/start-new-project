import {SortDirection} from "mongodb";
import {QueryCommentsModel} from "../models/commentModel";

export const paginationQueriesComments = (query: QueryCommentsModel): QueryCommentsModel => {
    return {
        pageNumber: query.pageNumber ? +query.pageNumber : 1,
        pageSize: query.pageSize !== undefined ? +query.pageSize : 10,
        sortBy: query.sortBy ? query.sortBy : 'createdAt',
        sortDirection: query.sortDirection ? query.sortDirection as SortDirection : 'desc',
    }
}