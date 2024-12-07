import {NextFunction, Request, Response} from "express";
import {jwtService} from "../../../helpers/jwtService";
import {usersRepository} from "../../users/users-db-repository";
import {SETTINGS} from "../../../settings";

export const accessTokenGuard = async (req: Request,
                                       res: Response,
                                       next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(401);
        return
    }

    const [authType, token] = req.headers.authorization.split(" ");

    if (authType !== 'Bearer') {
        res.sendStatus(401);
        return
    }

    const payload = await jwtService.verifyToken(token, SETTINGS.SECRET_KEY_FOR_ACCESS_TOKEN);

    if (payload) {
        // if (Math.floor(new Date().getTime() / 1000) >= payload.exp) {
        //     res.sendStatus(401);
        //     return
        // }
        const user = await usersRepository.doesExistById(payload.userId);
        if (!user) {
            res.sendStatus(401);
            return
        }

        req.user = {id: payload.userId}
        return next();
    }
    res.sendStatus(401);
}

