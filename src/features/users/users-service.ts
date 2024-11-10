import {UserInputModel} from "../../models/usersModels";
import {genHashPassword} from "../../helpers/genHashPassword";
import {usersRepository} from "./users-db-repository";

export const usersService = {

    async createUser(userInput: UserInputModel) {
        const {login, email, password} = userInput
        const isExistsLogin = await usersRepository.getUserByLogin(login)
        const isExistsEmail = await usersRepository.getUserByEmail(email)
        // if (isExistsEmail) {
        //     return {
        //         "errorsMessages": [
        //             {
        //                 "message": "email already exists",
        //                 "field": "email"
        //             }
        //         ]
        //     }
        // }
        // if (isExistsLogin) {
        //     return {
        //         "errorsMessages": [
        //             {
        //                 "message": "login already exists",
        //                 "field": "login"
        //             }
        //         ]
        //     }
        //
        // }
        const hashPassword = await genHashPassword(password)

        const newUser = {
            login,
            email,
            password: hashPassword,
            createdAt: new Date().toISOString(),
        }
        return await usersRepository.createUser(newUser)
    },

    async deleteUserById(id: string): Promise<boolean> {
        // const validateObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id)
        // if (!validateObjectId) return false
        return await usersRepository.deleteUserById(id)
    }
}