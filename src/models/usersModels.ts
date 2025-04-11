import {ObjectId, SortDirection} from "mongodb";
import {UUID} from "node:crypto";

export type QueryUserModel = {
    sortBy: string,
    sortDirection: SortDirection,
    pageNumber: number;
    pageSize: number;
    searchLoginTerm?: string | null;
    searchEmailTerm?: string | null;
}

export type UserViewModel = {
    id: string;
    login: string;
    email: string;
    createdAt: Date;
}

export type UserInputDBModel = {
    login: string;
    email: string;
    password: string;
    createdAt: Date;
    emailConfirmation: {
        confirmationCode: UUID,
        expirationDate: Date,
        isConfirmed: 'confirmed' | 'unconfirmed'
    }
}

export type UserDBModel = {
    _id: ObjectId;
    login: string;
    email: string;
    password: string;
    createdAt: Date;
    emailConfirmation: {
        confirmationCode: UUID,
        expirationDate?: Date,
        isConfirmed: 'confirmed' | 'unconfirmed'
    }
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
    code?: UUID
    isConfirmed?: 'confirmed' | 'unconfirmed'
    expirationDate?: Date;
}

export type LoginInputModel = {
    loginOrEmail: string;
    password: string;
    ip?: string;
    userAgent?: string;
}