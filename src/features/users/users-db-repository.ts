import {usersCollection} from "../../db/db";
import {SETTINGS} from "../../settings";
import {UserDBModel, UserInputDBModel, UserViewModel} from "../../models/usersModels";
import {ObjectId, WithId} from "mongodb";
import {checkObjectId} from "../../helpers/checkValidIdfromObjectId";
import {matchPasswords} from "../../helpers/genHashPassword";
import {UUID} from "node:crypto";


export const usersRepository = {

    async createUser(newUser: UserInputDBModel): Promise<UserDBModel> {
        const result = await usersCollection.insertOne(newUser);

        return {
            ...newUser,
            _id: result.insertedId,
        };
    },

    async isExistsUserByLogin(login: string): Promise<boolean> {
        const user = await usersCollection.findOne({login: login})
        if (user && user._id !== undefined) {
            return !!user._id.toString()
        }
        return false
    },

    async isExistsUserByEmail(email: string): Promise<boolean> {
        const user = await usersCollection.findOne({email: email})
        if (user && user._id !== undefined) {
            return !!user._id.toString()
        }
        return false
    },

    async getUserByEmail(email: string): Promise<UserDBModel | null> {
        return await usersCollection.findOne({email: email})
    },

    async getUserById(id: string): Promise<WithId<UserInputDBModel> | null> {
        return await usersCollection
            .findOne({_id: new ObjectId(id)});
    },

    async deleteUserById(id: string): Promise<boolean> {
        const result = await usersCollection
            .deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },

    async doesExistById(id: string): Promise<boolean> {
        if (!checkObjectId(id)) return false;
        const isUser = await usersCollection.findOne({_id: new ObjectId(id)});
        return !!isUser
    },

    async authLoginUser(loginOrEmail: string, password: string) {
        const user = await usersCollection.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]})
        if (!user) return null

        const isPassCorrect = await matchPasswords(password, user.password)
        if (!isPassCorrect) return null
        return user
    },

    async authRegistrationUser(loginOrEmail: string, password: string) {
        const user = await usersCollection.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]})
        if (!user) return null

        const isPassCorrect = await matchPasswords(password, user.password)
        if (!isPassCorrect) return null
        return user
    },

    async getUserByConfCode(code: string) {
        const user = await usersCollection
            .findOne({'emailConfirmation.confirmationCode': code})
        if (!user) return null
        return user
    },

    async updateConfirmationStatusForUser(id: ObjectId) {
        const user = await usersCollection
            .findOneAndUpdate({_id: new ObjectId(id)},
                {$set: {'emailConfirmation.isConfirmed': 'confirmed'}},
                {returnDocument: 'after'});
        if (!user) return false
        return user
    },

    async updateConfirmationCodeForUser(id: ObjectId, confCode: UUID) {
        const user = await usersCollection
            .findOneAndUpdate({_id: new ObjectId(id)},
                {$set: {'emailConfirmation.confirmationCode': confCode}},
                {returnDocument: 'after'});
        if (!user) return null
        return user
    },


}