import {ObjectId} from "mongodb";

export type AcknowlAnswer = {
    acknowledged: boolean,
    insertedId: ObjectId
}