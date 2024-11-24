import {jwtService} from "../../helpers/jwtService";
import {UserDBModel, UserInputDBModel, UserInputModel} from "../../models/usersModels";
import {ErrMessAndField} from "../../types/result";
import {usersRepository} from "../users/users-db-repository";
import {genHashPassword} from "../../helpers/genHashPassword";
import {randomUUID, UUID} from "node:crypto";
import {add} from "date-fns";
import {businessService} from "../../domains/businessService";

export const authService = {

    async authLoginUser(body: { loginOrEmail: string, password: string }) {
        const {loginOrEmail, password} = body;
        const user = await usersRepository.authLoginUser(loginOrEmail, password)
        if (!user) return null;

        return jwtService.createToken(user._id.toString())
    },

    async authRegistrationUser(user: UserInputModel) {
        const {login, email, password} = user
        const isExistsLogin = await usersRepository.isExistsUserByLogin(login)
        const isExistsEmail = await usersRepository.isExistsUserByEmail(email)
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
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: randomUUID(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 30,
                }),
                isConfirmed: 'unconfirmed',
            }
        }
        await usersRepository.createUser(newUser)

        const confCode: UUID = newUser.emailConfirmation.confirmationCode

        await businessService.sendConfirmationCodeToEmail(user.email, confCode)

        return ({
            status: 204
        })
    },

    async authRegistrationEmailResendUser(email: string) {
        const user: UserDBModel | null = await usersRepository.getUserByEmail(email)
        const errors: ErrMessAndField[] = []
        if (!user) {
            errors.push({
                "message": "email not found",
                "field": "email"
            })
        }
        if (user && user.emailConfirmation.isConfirmed === 'confirmed') {
            errors.push({
                "message": "email already confirmed",
                "field": "email"
            })
        }
        if (errors.length) return ({
            status: 400,
            errors: errors
        })
        const newConfirmationCode: UUID = randomUUID()
        if (user) {
            const updatedUser = await usersRepository
                .updateConfirmationCodeForUser(user._id, newConfirmationCode)
            await businessService
                .sendConfirmationCodeToEmail(user!.email, updatedUser!.emailConfirmation.confirmationCode)

        }

        return ({
            status: 204
        })
    },


    async authRegConfUser(code: string) {
        const user = await usersRepository.getUserByConfCode(code)
        if (user?.emailConfirmation.confirmationCode !== code) {
            return {
                status: 400,
                errors: [{
                    message: "code is wrong",
                    field: "confirmationCode"
                }]
            }
        }
        if (user?.emailConfirmation.expirationDate! < new Date()) {
            console.log('exp', user.emailConfirmation.expirationDate)
            return {
                status: 400,
                errors: [{
                    message: "code expired",
                    field: "expirationDate"
                }]
            }
        }

        if (user?.emailConfirmation.isConfirmed === 'confirmed') {
            console.log('exp', user.emailConfirmation.expirationDate)
            return {
                status: 400,
                errors: [{
                    message: "code already confirmed",
                    field: "code"
                }]
            }
        }

        const isChanchedStatus = await usersRepository.updateConfirmationStatusForUser(user._id)
        return {
            status: 204,
            data: 'Email was verified. Account was activated'
        }
    }
}
