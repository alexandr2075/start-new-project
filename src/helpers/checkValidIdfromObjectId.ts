import {ObjectId} from "mongodb";

export const checkObjectId = (id: string) => {
    return ObjectId.isValid(id)
}

