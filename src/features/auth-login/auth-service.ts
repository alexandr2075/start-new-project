import {add} from "date-fns";
import {randomUUID, UUID} from "node:crypto";
import {businessService} from "../../domains/businessService";
import {genHashPassword} from "../../helpers/genHashPassword";
import {jwtService} from "../../helpers/jwtService";
import {UserDBModel, UserInputDBModel, UserInputModel} from "../../models/usersModels";
import {ErrMessAndField} from "../../types/result";
import {securityService} from "../security/security-service";
import {usersRepository} from "../users/users-db-repository";
import type {DeviceDBType} from "../../models/securityModels";
import {securityRepository} from "../security/security-repository";

type LoginInputModel = {
    loginOrEmail: string;
    password: string;
    ip?: string;
    userAgent?: string;
};

export const authService = {

    async authLoginUser(loginData: LoginInputModel) {
        const user = await this._validateUser(loginData);
        if (!user) return null;
        const deviceId = randomUUID();
        const tokens = await this._generateTokens(user._id.toString(), deviceId);

        const payloadRT = await jwtService.decodeToken(tokens.refreshToken);
        const device: DeviceDBType = {
            deviceId,
            userId: user._id.toString(),
            ip: loginData.ip || '',
            title: loginData.userAgent || 'Unknown device',
            lastActiveDate: payloadRT.iat,
            expirationDate: payloadRT.exp
        };
        await securityRepository.createDevice(device);

        return tokens;
    },

    async authUpdatePairTokens(refreshToken: string) {
        const payload = await jwtService.decodeToken(refreshToken);
        if (!payload) return null;

        const tokens = await this._generateTokens(
            payload.userId,
            payload.deviceId
        );
        const decRT = await jwtService.decodeToken(tokens.refreshToken);
        await securityService.updateIat(payload.deviceId, decRT.iat);
        return tokens;
    },

    async authDeleteRefreshToken(refreshToken: string) {
        const payload = await jwtService.decodeToken(refreshToken);
        if (!payload) return null;

        return securityService.deleteDevice(payload.deviceId, payload.userId);
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

        const htmlEmail = `<h1>Thanks for your registration</h1>
                           <p>To finish registration please follow the link below:
                           <a href="https://it-incubator.io/confirm-email?code=${confCode}">complete registration</a>
                           </p>`;

        await businessService.sendCodeToEmail(user.email, htmlEmail)

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
            await usersRepository
                .updateUser(user._id, 'emailConfirmation.confirmationCode', newConfirmationCode)

            const htmlEmail = `<h1>Password recovery</h1>
                           <p>To finish password recovery please follow the link below:
                           <a href="https://somesite.com/password-recovery?recoveryCode=${newConfirmationCode}">recovery password</a>
                           </p>`;

            await businessService
                .sendCodeToEmail(user!.email, htmlEmail)

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
    },

    async authRecoveryPassword(email: string) {
        const user = await usersRepository.getUserByEmail(email)
        if (user) {
            const updatedUser = await usersRepository.updateConfirmationCode(user._id)
            const code = updatedUser.emailConfirmation.confirmationCode
            const htmlEmail = `<h1>Password recovery</h1>
                           <p>To finish password recovery  please follow the link below:
                           <a href="https://it-incubator.io/confirm-email?recoveryCode=${code}">recovery password</a>
                           </p>`;

            await businessService.sendCodeToEmail(user.email, htmlEmail)
        }
    },

    async authChangePassword(newPassword: string, recoveryCode: string) {
        const user = await usersRepository.getUserByConfCode(recoveryCode)
        if (user && user.emailConfirmation.confirmationCode === recoveryCode
            && user.emailConfirmation.expirationDate > new Date()
        ) {
            const hashPassword = await genHashPassword(newPassword)
            await usersRepository
                .updateUser(user.id, 'password', hashPassword)
            return true
        } else {
            return false
        }
    },

    async _validateUser(loginData: LoginInputModel): Promise<UserDBModel | null> {
        const user = await usersRepository.authLoginUser(loginData.loginOrEmail, loginData.password);
        if (!user) return null;

        // if (user.emailConfirmation.isConfirmed !== 'confirmed') return null;

        return user;
    },

    async _generateTokens(userId: string, deviceId: string) {
        const tokens = await jwtService.createTokens(userId, deviceId);

        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        };
    }
}
