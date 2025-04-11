import mongoose, {HydratedDocument, Model, model} from "mongoose";
import {RequestAttemptDBType} from "../models/requestModels";


type RequestModel = Model<RequestAttemptDBType>;
export type RequestDocument = HydratedDocument<RequestAttemptDBType>;

const RequestSchema = new mongoose.Schema({
    ip: String,
    url: String,
    date: Date
})

export const RequestModel = model<RequestAttemptDBType, RequestModel>('Request', RequestSchema)