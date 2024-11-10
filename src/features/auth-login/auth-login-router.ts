import express, {Request, Response} from "express";
import {HTTP_STATUS} from "../../settings";
import {authLoginService} from "./auth-login-service";
import {checkIsStringMiddleware, checkPasswordMiddleware} from "../users/middlewaresUsers";
import {sendAccumulatedErrorsMiddleware} from "../../commonMiddleware/sendAccumulatedErrorsMiddleware";

export const authLoginRouter = express.Router();

//auth user
authLoginRouter.post("/",
    checkIsStringMiddleware,
    checkPasswordMiddleware,
    sendAccumulatedErrorsMiddleware,
    async (req: Request, res: Response) => {
        const result = await authLoginService.authLoginUser(req.body)
        if (result) {
            res.status(HTTP_STATUS.NO_CONTENT).send(result)
        } else {
            res.send(HTTP_STATUS.UNAUTHORIZED)
        }
    })