import express, {Request, Response} from "express";
import {HTTP_STATUS, SETTINGS} from "../../settings";
import {authLoginService} from "./auth-login-service";
import {checkIsStringMiddleware, checkPasswordMiddleware} from "../users/middlewaresUsers";
import {sendAccumulatedErrorsMiddleware} from "../../commonMiddleware/sendAccumulatedErrorsMiddleware";
import {accessTokenGuard} from "./guards/access.token.guard";
import {RequestWithUserId} from "../../types/requestPaginationFilter";
import {IdType} from "../../types/id";
import {usersQueryRepository} from "../users/users-query-repository";

export const authLoginRouter = express.Router();

//auth user
authLoginRouter.post("/",
    checkIsStringMiddleware,
    checkPasswordMiddleware,
    sendAccumulatedErrorsMiddleware,
    async (req: Request, res: Response) => {
        const token = await authLoginService.authLoginUser(req.body)

        if (token) {
            res.status(HTTP_STATUS.OK).send({accessToken: token})
        } else {
            res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
        }
    })

authLoginRouter.get(SETTINGS.PATH.AUTH_ME,
    accessTokenGuard,
    async (req: RequestWithUserId<IdType>,
           res: Response) => {
        const userId = req?.user?.id as string;

        if (!userId) {
            res.sendStatus(401);
            return
        }
        const me = await usersQueryRepository.findById(userId);

        res.status(200).send(me);
    })