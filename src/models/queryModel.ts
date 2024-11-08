import {SortDirection} from "mongodb";

export type BlogQueryFilter = {
    pageNumber: number;
    pageSize: number;
    sortDirection: SortDirection;
    sortBy: string;
}

export type PostQueryFilter = {
    pageNumber: number;
    pageSize: number;
    sortDirection: SortDirection;
    sortBy: string;
}