import {client} from "../../db/dbMongo";
import {SETTINGS} from "../../settings";
import {UserInputDBModel} from "../../models/usersModels";
import {matchPasswords} from "../../helpers/genHashPassword";

export const authLoginRepository = {

    async authLoginUser(loginOrEmail: string, password: string) {
        const result = await client.db(SETTINGS.DB_NAME)
            .collection<UserInputDBModel>('users').findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]})
        if (result) {
            return await matchPasswords(password, result.password)
        }
        return false
    },

}