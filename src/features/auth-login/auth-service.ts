import {jwtService} from "../../helpers/jwtService";
import {UserDBModel, UserInputDBModel, UserInputModel} from "../../models/usersModels";
import {ErrMessAndField} from "../../types/result";
import {usersRepository} from "../users/users-db-repository";
import {genHashPassword} from "../../helpers/genHashPassword";
import {randomUUID, UUID} from "node:crypto";
import {add} from "date-fns";
import {businessService} from "../../domains/businessService";
import {SETTINGS} from "../../settings";
import {createNewPairTokens} from "../../helpers/createNewPairTokens";

export const authService = {

    async authLoginUser(body: { loginOrEmail: string, password: string }) {
        const {loginOrEmail, password} = body;
        const user = await usersRepository.authLoginUser(loginOrEmail, password)
        if (!user) return null;
        const {accessToken, refreshToken, iatVersionToken} = await createNewPairTokens(user._id.toString())
        await usersRepository.updateUser(
            user._id,
            'iatVersionToken',
            iatVersionToken.iat)
        return {accessToken, refreshToken}
    },

    async authUpdatePairTokens(token: string) {
        const decodeToken = await jwtService.decodeToken(token)
        const user = await usersRepository.getUserById(decodeToken.userId)
        if (!user || user.iatVersionToken !== decodeToken.iat) return null;
        const {accessToken, refreshToken, iatVersionToken} = await createNewPairTokens(decodeToken.userId)
        await usersRepository.updateUser(
            decodeToken.userId,
            'iatVersionToken',
            iatVersionToken.iat)
        return {accessToken, refreshToken}
    },

    async authDeleteRefreshToken(token: string) {
        const decodeToken = await jwtService.decodeToken(token)
        if (!decodeToken) return null;
        const user = await usersRepository.getUserById(decodeToken.userId)
        if (!user || user.iatVersionToken !== decodeToken.iat) return null;
        await usersRepository.updateUser(
            decodeToken.userId,
            'iatVersionToken',
            null)
        return true
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
            createdAt: new Date(),
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
                .updateUser(user._id, 'emailConfirmation.confirmationCode', newConfirmationCode)
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

        await usersRepository.updateUser(
            user._id,
            'emailConfirmation.confirmationCode',
            'confirmed')
        return {
            status: 204,
            data: 'Email was verified. Account was activated'
        }
    }
}
