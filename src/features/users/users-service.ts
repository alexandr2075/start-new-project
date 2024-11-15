import {UserInputDBModel, UserInputModel} from "../../models/usersModels";
import {genHashPassword} from "../../helpers/genHashPassword";
import {usersRepository} from "./users-db-repository";
import {ErrMessAndField, Result} from "../../types/result";
import {InsertOneResult} from "mongodb";

export const usersService = {

    async createUser(userInput: UserInputModel): Promise<Result<InsertOneResult<UserInputDBModel>>> {
        const {login, email, password} = userInput
        const isExistsLogin = await usersRepository.getUserByLogin(login)
        const isExistsEmail = await usersRepository.getUserByEmail(email)
        const errors: ErrMessAndField[] = []
        if (isExistsEmail) {
            errors.push({
                "message": "email already exists",
                "field": "email"
            })
        }
        if (isExistsLogin) {
            errors.push({
                "message": "login already exists",
                "field": "login"
            })
        }
        if (errors.length) return ({
            status: 400,
            errors: errors
        })
        const hashPassword = await genHashPassword(password)

        const newUser = {
            login,
            email,
            password: hashPassword,
            createdAt: new Date().toISOString(),
        }
        return {
            status: 200,
            data: (await usersRepository.createUser(newUser))
        }
    },

    async deleteUserById(id: string): Promise<boolean> {
        // const validateObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id)
        // if (!validateObjectId) return false
        return await usersRepository.deleteUserById(id)
    }
}