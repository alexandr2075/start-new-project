import {UserInputDBModel, UserInputModel} from "../../models/usersModels";
import {genHashPassword} from "../../helpers/genHashPassword";
import {usersRepository} from "./users-db-repository";
import {ErrMessAndField, Result} from "../../types/result";
import {InsertOneResult} from "mongodb";
import {randomUUID} from "node:crypto";
import {add} from "date-fns";

export const usersService = {

    async createUser(userInput: UserInputModel) {
        const {login, email, password} = userInput
        const isExistsLogin = await usersRepository.isExistsUserByLogin(login)
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

        const newUser: UserInputDBModel = {
            login,
            email,
            password: hashPassword,
            createdAt: new Date(),
            emailConfirmation: {
                confirmationCode: randomUUID(),
                isConfirmed: 'unconfirmed',
            }
        }
        const createdUser = await usersRepository.createUser(newUser)

        return {
            status: 200,
            data: createdUser
        }
    },

    async deleteUserById(id: string): Promise<boolean> {
        return await usersRepository.deleteUserById(id)
    }
}