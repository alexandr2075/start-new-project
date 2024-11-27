import {jwtService} from "./jwtService";
import {SETTINGS} from "../settings";

export const createNewPairTokens = async (id: string,) => {
    const accessToken = await jwtService.createToken(
        id,
        SETTINGS.SECRET_KEY_FOR_ACCESS_TOKEN,
        SETTINGS.EXP_TIME_FOR_ACCESS_TOKEN)
    const refreshToken = await jwtService.createToken(
        id,
        SETTINGS.SECRET_KEY_FOR_REFRESH_TOKEN,
        SETTINGS.EXP_TIME_FOR_REFRESH_TOKEN)
    const iatVersionToken = await jwtService.decodeToken(refreshToken)
    return {
        accessToken,
        refreshToken,
        iatVersionToken,
    }

}