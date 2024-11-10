import {authLoginRepository} from "./auth-login-db-repository";

export const authLoginService = {

    async authLoginUser(body: { loginOrEmail: string, password: string }) {
        const {loginOrEmail, password} = body;
        return await authLoginRepository.authLoginUser(loginOrEmail, password)
    },
}