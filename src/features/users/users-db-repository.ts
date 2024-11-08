import {client} from "../../db/dbMongo";
import {SETTINGS} from "../../settings";
import {UserInputDBModel, UserViewModel} from "../../models/usersModels";
import {ObjectId} from "mongodb";

export const usersRepository = {

    async createUser(newUser: UserInputDBModel) {

        const result = await client.db(SETTINGS.DB_NAME)
            .collection<UserInputDBModel>('users').insertOne(newUser)

        return this.getUserByObjectId(result.insertedId)
    },

    async getUserByObjectId(_id: ObjectId) {
        return await client.db(SETTINGS.DB_NAME).collection<UserViewModel>('users').find({_id})
    },

    async getUserByLogin(login: string): Promise<boolean> {
        const user = await client.db(SETTINGS.DB_NAME).collection<UserViewModel>('users').find({login: login})
        return !!user
    },

    async getUserByEmail(email: string): Promise<boolean> {
        const user = await client.db(SETTINGS.DB_NAME).collection<UserViewModel>('users').find({email: email})
        return !!user
    },

    async deleteUserById(id: string): Promise<boolean> {

        const result = await client.db(SETTINGS.DB_NAME)
            .collection<UserViewModel>('users')
            .deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }
}