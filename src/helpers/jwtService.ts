import jwt, {JwtPayload} from "jsonwebtoken";
import {SETTINGS} from "../settings";

export type JwtPayloadType = {

    userId: string,
    iat: number,
    exp: number
}


export const jwtService = {
    async createTokens(userId: string, deviceId: string) {
        const accessToken = jwt.sign(
            {userId},
            SETTINGS.SECRET_KEY_FOR_ACCESS_TOKEN,
            {expiresIn: SETTINGS.EXP_TIME_FOR_ACCESS_TOKEN}
        );

        const refreshToken = jwt.sign(
            {userId, deviceId},
            SETTINGS.SECRET_KEY_FOR_REFRESH_TOKEN,
            {expiresIn: SETTINGS.EXP_TIME_FOR_REFRESH_TOKEN}
        );

        return {accessToken, refreshToken};
    },
    async decodeToken(token: string): Promise<any> {
        try {
            return jwt.decode(token);
        } catch (e: unknown) {
            console.error("Can't decode token", e);
            return null;
        }
    },

    async verifyToken(token: string, secretKey: string): Promise<(JwtPayload & JwtPayloadType) | null> {
        try {

            const decoded = jwt.verify(token, secretKey);
            console.log('decoded', decoded);
            if (typeof decoded !== 'object' || decoded === null) {
                console.error("Invalid token payload structure");
                return null;
            }

            return decoded as JwtPayload & JwtPayloadType;
        } catch (error) {
            console.error("Token verification error:", error);
            return null;
        }
    }
};