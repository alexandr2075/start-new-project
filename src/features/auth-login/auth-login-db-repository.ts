import {client} from "../../db/dbMongo";
import {SETTINGS} from "../../settings";
import {UserInputDBModel} from "../../models/usersModels";
import {matchPasswords} from "../../helpers/genHashPassword";

export const authLoginRepository = {

    async authLoginUser(loginOrEmail: string, password: string) {
        const user = await client.db(SETTINGS.DB_NAME)
            .collection<UserInputDBModel>('users').findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]})
        if (!user) return null

        const isPassCorrect = await matchPasswords(password, user.password)
        if (!isPassCorrect) return null
        console.log('user', user)
        return user
    },

}