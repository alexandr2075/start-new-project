import {HydratedDocument, Model, model, Schema} from "mongoose";
import {UserInputDBModel} from "../models/usersModels";

enum ConfirmationStatus {
    Сonfirmed = 'confirmed',
    Unconfirmed = 'unconfirmed',
}

type UserModel = Model<UserInputDBModel>;
export type UserDocument = HydratedDocument<UserInputDBModel>;

const UserSchema = new Schema<UserInputDBModel>({
    login: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    emailConfirmation: {
        confirmationCode: {type: String},
        expirationDate: {type: Date, required: true},
        isConfirmed: {
            type: String,
            enum: ['confirmed', 'unconfirmed'],
            default: ConfirmationStatus.Unconfirmed,
        },
    }
})

export const UserModel = model<UserInputDBModel, UserModel>("User", UserSchema);
