import jwt from "jsonwebtoken";


export const jwtService = {
    async createToken(userId: string, secretKey: string, expTime: string): Promise<string> {
        return jwt.sign(
            {userId},
            secretKey,
            {
                expiresIn: expTime,
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
    async verifyToken(token: string, secretKey: string): Promise<{ userId: string } | null> {
        try {
            return jwt.verify(token, secretKey) as { userId: string };
        } catch (error) {
            console.error("Token verify some error", error);
            return null;
        }
    },
};