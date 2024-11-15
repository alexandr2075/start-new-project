import {SortDirection} from "mongodb";

export type QueryFilter = {
    pageNumber: number;
    pageSize: number;
    sortDirection: SortDirection;
    sortBy: string;
}
