import {NextFunction, Request, Response} from "express";
import {jwtService} from "../../../helpers/jwtService";
import {usersRepository} from "../../users/users-db-repository";
import {IdType} from "../../../types/id";
import {SETTINGS} from "../../../settings";

export const refreshTokenGuard = async (req: Request,
                                        res: Response,
                                        next: NextFunction) => {
    if (!req.cookies.refreshToken) {
        res.sendStatus(401);
        return
    }
    const payload = await jwtService.verifyToken(req.cookies.refreshToken, SETTINGS.SECRET_KEY_FOR_REFRESH_TOKEN);

    if (!payload) {
        res.sendStatus(401);
        return
    }
    if (Math.floor(new Date().getTime() / 1000) >= payload.exp) {
        res.sendStatus(401);
        return
    }

    req.user = {id: payload.userId}
    return next();
}

