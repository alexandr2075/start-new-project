import {client} from "../../db/dbMongo";
import {SETTINGS} from "../../settings";
import {UserInputDBModel, UserViewModel} from "../../models/usersModels";
import {ObjectId} from "mongodb";

export const usersRepository = {

    async createUser(newUser: UserInputDBModel) {
        return await client.db(SETTINGS.DB_NAME)
            .collection<UserInputDBModel>('users').insertOne(newUser)
    },

    async getUserByLogin(login: string): Promise<boolean> {
        const user = await client.db(SETTINGS.DB_NAME).collection<UserViewModel>('users').findOne({login: login})
        if (user && user._id !== undefined) {
            return !!user._id.toString()
        }
        return false
    },

    async getUserByEmail(email: string): Promise<boolean> {
        const user = await client.db(SETTINGS.DB_NAME).collection<UserViewModel>('users').findOne({email: email})
        if (user && user._id !== undefined) {
            return !!user._id.toString()
        }
        return false
    },

    async deleteUserById(id: string): Promise<boolean> {
        const result = await client.db(SETTINGS.DB_NAME)
            .collection<UserViewModel>('users')
            .deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }
}