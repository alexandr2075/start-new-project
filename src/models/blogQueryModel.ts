import {SortDirection} from "mongodb";

export type BlogQuery = {
    pageNumber: number;
    pageSize: number;
    sortDirection: SortDirection;
    sortBy: string;
}