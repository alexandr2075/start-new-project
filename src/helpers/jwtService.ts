import jwt, {JwtPayload} from "jsonwebtoken";

export type JwtPayloadType = {

    userId: string,
    iat: number,
    exp: number
}


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

    async verifyToken(token: string, secretKey: string): Promise<(JwtPayload & JwtPayloadType) | null> {
        try {

            const decoded = jwt.verify(token, secretKey);

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