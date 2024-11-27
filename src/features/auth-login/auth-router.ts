import express, {Request, Response} from "express";
import {HTTP_STATUS} from "../../settings";
import {authService} from "./auth-service";
import {
    checkEmailMiddleware,
    checkIsStringMiddleware,
    checkIsValidConfCodeMiddleware,
    checkPasswordMiddleware,
    userValidator
} from "../users/middlewaresUsers";
import {sendAccumulatedErrorsMiddleware} from "../../commonMiddleware/sendAccumulatedErrorsMiddleware";
import {accessTokenGuard} from "./guards/access.token.guard";
import {RequestWithUserId} from "../../types/requestPaginationFilter";
import {IdType} from "../../types/id";
import {usersQueryRepository} from "../users/users-query-repository";

export const authRouter = express.Router();

//auth user
authRouter.post("/login",
    checkIsStringMiddleware,
    checkPasswordMiddleware,
    sendAccumulatedErrorsMiddleware,
    async (req: Request, res: Response) => {
        console.log('body', req.body);
        const tokens = await authService.authLoginUser(req.body)

        if (tokens) {
            res.cookie('cookie_refresh', tokens.refreshToken, {httpOnly: true, secure: true})
            res.status(HTTP_STATUS.OK).send({accessToken: tokens.accessToken})
        } else {
            res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
        }
    })

//refresh-token
authRouter.post("/refresh-token",
    async (req: Request, res: Response) => {
        const refreshTokenFromCookies = req.cookies.cookie_refresh
        const tokens = await authService.authUpdatePairTokens(refreshTokenFromCookies)

        if (tokens) {
            res.cookie('cookie_refresh', tokens.refreshToken, {httpOnly: true, secure: true})
            res.status(HTTP_STATUS.OK).send({accessToken: tokens})
        } else {
            res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
        }
    })

//logout
authRouter.post("/logout",
    async (req: Request, res: Response) => {
        const refreshTokenFromCookies = req.cookies.cookie_refresh
        const isLogout = await authService.authDeleteRefreshToken(refreshTokenFromCookies)

        if (isLogout) {
            res.sendStatus(HTTP_STATUS.NO_CONTENT)
        } else {
            res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
        }
    })

authRouter.get("/me",
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

//registration user with confirmation code
authRouter.post("/registration",
    userValidator,
    sendAccumulatedErrorsMiddleware,
    async (req: Request, res: Response) => {
        const result = await authService.authRegistrationUser(req.body)

        if (result.status === HTTP_STATUS.NO_CONTENT) {
            res.sendStatus(HTTP_STATUS.NO_CONTENT)
        } else {
            res.status(HTTP_STATUS.BAD_REQUEST).send({'errorsMessages': result.errors})
        }
    })

authRouter.post("/registration-email-resending",
    checkEmailMiddleware,
    sendAccumulatedErrorsMiddleware,
    async (req: Request, res: Response) => {
        const result = await authService.authRegistrationEmailResendUser(req.body.email)

        if (result.status === HTTP_STATUS.NO_CONTENT) {
            res.sendStatus(HTTP_STATUS.NO_CONTENT)
        } else {
            res.status(HTTP_STATUS.BAD_REQUEST).send({'errorsMessages': result.errors})
        }
    })

//check user with confirmation code
authRouter.post("/registration-confirmation",
    checkIsValidConfCodeMiddleware,
    sendAccumulatedErrorsMiddleware,
    async (req: Request, res: Response) => {
        const result = await authService.authRegConfUser(req.body.code)
        if (result.status === HTTP_STATUS.NO_CONTENT) {
            res.status(HTTP_STATUS.NO_CONTENT).send(result.data)
        } else {
            res.status(HTTP_STATUS.BAD_REQUEST).send({'errorsMessages': result.errors})
        }
    })