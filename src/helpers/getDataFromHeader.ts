import {NextFunction, Request, Response} from "express";
import {jwtService} from "./jwtService";
import {SETTINGS} from "../settings";

export const getDataFromHeader = async (req: Request,
                                        res: Response,
                                        next: NextFunction) => {
    if (req.headers.authorization) {
        const [authType, token] = req.headers.authorization.split(" ");

        const payload = await jwtService.verifyToken(token, SETTINGS.SECRET_KEY_FOR_ACCESS_TOKEN);
        if (payload) {
            req.user = {id: payload.userId}
            return next();
        }
    }

    if (!req.headers.authorization) {
        req.user = {id: ''}
    }

    return next();
}