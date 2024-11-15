import {authLoginRepository} from "./auth-login-db-repository";
import {jwtService} from "../../helpers/jwtService";

export const authLoginService = {

    async authLoginUser(body: { loginOrEmail: string, password: string }) {
        const {loginOrEmail, password} = body;
        const user = await authLoginRepository.authLoginUser(loginOrEmail, password)
        if (!user) return null;

        return jwtService.createToken(user._id.toString())
    },
}