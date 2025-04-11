import express, {Request, Response} from "express";
import {HTTP_STATUS} from "../../settings";
import {authService} from "./auth-service";
import {
    checkEmailMiddleware,
    checkIsStringMiddleware,
    checkIsValidConfCodeMiddleware,
    checkIsValidRecCodeMiddleware,
    checkNewPasswordMiddleware,
    checkPasswordMiddleware,
    userValidator
} from "../users/middlewaresUsers";
import {sendAccumulatedErrorsMiddleware} from "../../commonMiddleware/sendAccumulatedErrorsMiddleware";
import {accessTokenGuard} from "./guards/access.token.guard";
import {RequestWithUserId} from "../../types/requestPaginationFilter";
import {IdType} from "../../types/id";
import {usersQueryRepository} from "../users/users-query-repository";
import {checkRefreshTokenCookieMiddleware} from "./middlewaresAuth";
import {refreshTokenGuard} from "./guards/refresh.token.guard";
import {requestCountMiddleware} from "../../middlewares/request-count.middleware";

export const authRouter = express.Router();

//auth user
authRouter.post("/login",
    requestCountMiddleware,
    checkIsStringMiddleware,
    checkPasswordMiddleware,
    sendAccumulatedErrorsMiddleware,
    async (req: Request, res: Response) => {
        const tokens = await authService.authLoginUser({...req.body, ...req.clientMeta})
        if (tokens) {
            res.cookie('refreshToken', tokens.refreshToken, {httpOnly: true, secure: true})
            res.status(HTTP_STATUS.OK).send({accessToken: tokens.accessToken})
        } else {
            res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
        }
    })

//refresh-token
authRouter.post("/refresh-token",
    // checkRefreshTokenCookieMiddleware,
    requestCountMiddleware,
    refreshTokenGuard,
    sendAccumulatedErrorsMiddleware,
    async (req: Request, res: Response) => {
        const refreshTokenFromCookies = req.cookies.refreshToken
        console.log('refreshTokenFromCookies:', refreshTokenFromCookies)
        const tokens = await authService.authUpdatePairTokens(refreshTokenFromCookies)

        if (tokens) {
            res.cookie('refreshToken', tokens.refreshToken, {httpOnly: true, secure: true})
            res.status(HTTP_STATUS.OK).send({accessToken: tokens.accessToken})
        } else {
            res.sendStatus(HTTP_STATUS.UNAUTHORIZED)
        }
    })

//logout
authRouter.post("/logout",
    checkRefreshTokenCookieMiddleware,
    refreshTokenGuard,
    sendAccumulatedErrorsMiddleware,
    async (req: Request, res: Response) => {
        const refreshTokenFromCookies = req.cookies.refreshToken

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
        const userId = req.user.id
        if (!userId) {
            res.sendStatus(401);
            return
        }
        const me = await usersQueryRepository.findById(userId);
        if (me) {
            res.status(200).send({
                userId: me.id,
                login: me.login,
                email: me.email,
            });
        } else {
            res.status(401)
        }

    })

//registration user with confirmation code
authRouter.post("/registration",
    requestCountMiddleware,
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
    requestCountMiddleware,
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
    requestCountMiddleware,
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

//send recovery code to email
authRouter.post("/password-recovery",
    requestCountMiddleware,
    checkEmailMiddleware,
    sendAccumulatedErrorsMiddleware,
    async (req: Request, res: Response) => {
        await authService.authRecoveryPassword(req.body.email)
        res.status(HTTP_STATUS.NO_CONTENT).send('ok')
    })

//new password
authRouter.post("/new-password",
    requestCountMiddleware,
    checkNewPasswordMiddleware,
    checkIsValidRecCodeMiddleware,
    sendAccumulatedErrorsMiddleware,
    async (req: Request, res: Response) => {
        const result = await authService.authChangePassword(req.body.newPassword, req.body.recoveryCode)
        if (result) {
            res.sendStatus(HTTP_STATUS.NO_CONTENT)
        } else {
            res.status(HTTP_STATUS.BAD_REQUEST)
        }
    })