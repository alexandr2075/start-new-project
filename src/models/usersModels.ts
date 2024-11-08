import {SortDirection} from "mongodb";

export type QueryUserModel = {
    sortBy: string,
    sortDirection: SortDirection,
    pageNumber: number;
    pageSize: number;
    searchLoginTerm: string | null;
    searchEmailTerm: string | null;
}

export type UserViewModel = {
    id: string;
    login: string;
    email: string;
    createdAt: string;
}

export type UserInputDBModel = {
    login: string;
    email: string;
    password: string;
    createdAt: string;
}

export type UsersViewModel = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: UserViewModel[];
}

export type UserInputModel = {
    login: string;
    password: string;
    email: string;
}
