import {ObjectId} from "mongodb";

export type BlogReqModel = {
    name: string
    description: string
    websiteUrl: string
}

// export type BlogInputModel = {
//     id: string;
//     name: string
//     description: string
//     websiteUrl: string
//     createdAt: Date;
//     isMembership: boolean;
// }

export type BlogViewModel = {
    id?: string;
    name: string
    description: string
    websiteUrl: string
    createdAt: Date;
    isMembership: boolean;
}

export type BlogViewModelInDB = {
    _id: ObjectId
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}


