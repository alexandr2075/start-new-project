import jwt from "jsonwebtoken";
import {SETTINGS} from "../settings";


export const jwtService = {
    async createToken(userId: string): Promise<string> {
        return jwt.sign(
            {userId},
            SETTINGS.SECRET_KEY,
            {
                expiresIn: SETTINGS.EXP_TIME,
            }
        );
    },
    async decodeToken(token: string): Promise<any> {
        try {
            return jwt.decode(token);
        } catch (e: unknown) {
            console.error("Can't decode token", e);
            return null;
        }
    },
    async verifyToken(token: string): Promise<{ userId: string } | null> {
        try {
            return jwt.verify(token, SETTINGS.SECRET_KEY) as { userId: string };
        } catch (error) {
            console.error("Token verify some error", error);
            return null;
        }
    },
};