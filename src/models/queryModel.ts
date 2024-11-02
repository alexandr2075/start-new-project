import {SortDirection} from "mongodb";

export type RequestQuery = {
    pageNumber: number;
    pageSize: number;
    sortDirection: SortDirection;
    sortBy: string;
}