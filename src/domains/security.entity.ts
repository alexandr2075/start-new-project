import {HydratedDocument, Model, model, Schema} from "mongoose";
import {DeviceDBType} from "../models/securityModels";

type SecurityModel = Model<DeviceDBType>;
export type SecurityDocument = HydratedDocument<DeviceDBType>;

const SecuritySchema = new Schema({
    deviceId: String,
    userId: String,
    ip: String,
    title: String,
    lastActiveDate: Date,
    expirationDate: Date
})

export const SecurityModel = model<DeviceDBType, SecurityModel>("Security", SecuritySchema);