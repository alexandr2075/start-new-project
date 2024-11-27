import {db} from "../../db/db";
import {UserDBModel, UserInputDBModel} from "../../models/usersModels";
import {ObjectId, WithId} from "mongodb";
import {checkObjectId} from "../../helpers/checkValidIdfromObjectId";
import {matchPasswords} from "../../helpers/genHashPassword";
import {UUID} from "node:crypto";


export const usersRepository = {

    async createUser(newUser: UserInputDBModel): Promise<UserDBModel> {
        const result = await db.getCollectionByName('users').insertOne(newUser);
        return {
            ...newUser,
            _id: result.insertedId,
        };
    },

    async isExistsUserByLogin(login: string): Promise<boolean> {
        const user = await db.getCollectionByName('users').findOne({login: login})
        if (user && user._id !== undefined) {
            return !!user._id.toString()
        }
        return false
    },

    async isExistsUserByEmail(email: string): Promise<boolean> {
        const user = await db.getCollectionByName('users').findOne({email: email})
        if (user && user._id !== undefined) {
            return !!user._id.toString()
        }
        return false
    },

    async getUserByEmail(email: string): Promise<UserDBModel | null> {
        return await db.getCollectionByName('users').findOne({email: email})
    },

    async getUserById(id: string): Promise<WithId<UserDBModel> | null> {
        return await db.getCollectionByName('users')
            .findOne({_id: new ObjectId(id)});
    },

    async deleteUserById(id: string): Promise<boolean> {
        const result = await db.getCollectionByName('users')
            .deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },

    async doesExistById(id: string): Promise<boolean> {
        if (!checkObjectId(id)) return false;
        const isUser = await db.getCollectionByName('users').findOne({_id: new ObjectId(id)});
        return !!isUser
    },

    async authLoginUser(loginOrEmail: string, password: string) {
        const user = await db.getCollectionByName('users').findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]})
        if (!user) return null

        const isPassCorrect = await matchPasswords(password, user.password)
        if (!isPassCorrect) return null
        return user
    },

    async authRegistrationUser(loginOrEmail: string, password: string) {
        const user = await db.getCollectionByName('users').findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]})
        if (!user) return null

        const isPassCorrect = await matchPasswords(password, user.password)
        if (!isPassCorrect) return null
        return user
    },

    async getUserByConfCode(code: string) {
        const user = await db.getCollectionByName('users')
            .findOne({'emailConfirmation.confirmationCode': code})
        if (!user) return null
        return user
    },

    async updateUser(id: ObjectId, fieldName: string, fieldValue: string | Date | UUID | null) {
        const user = await db.getCollectionByName('users')
            .findOneAndUpdate({_id: new ObjectId(id)},
                {$set: {[fieldName]: fieldValue}},
                {returnDocument: 'after'});
        if (!user) return null
        return user
    },

    // async updateConfirmationStatusForUser(id: ObjectId) {
    //     const user = await db.getCollectionByName('users')
    //         .findOneAndUpdate({_id: new ObjectId(id)},
    //             {$set: {'emailConfirmation.isConfirmed': 'confirmed'}},
    //             {returnDocument: 'after'});
    //     if (!user) return false
    //     return user
    // },
    //
    // async updateConfirmationCodeForUser(id: ObjectId, confCode: UUID) {
    //     const user = await db.getCollectionByName('users')
    //         .findOneAndUpdate({_id: new ObjectId(id)},
    //             {$set: {'emailConfirmation.confirmationCode': confCode}},
    //             {returnDocument: 'after'});
    //     if (!user) return null
    //     return user
    // },


}