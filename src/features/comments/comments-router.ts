import express, {Request, Response} from "express";
import {sendAccumulatedErrorsMiddleware} from "../../commonMiddleware/sendAccumulatedErrorsMiddleware";
import {HTTP_STATUS} from "../../settings";
import {ReqWithParams} from "../../types/requestPaginationFilter";
import {accessTokenGuard} from "../auth-login/guards/access.token.guard";
import {
    checkCommentIdFromParamMiddleware,
    checkContentMiddleware, checkLikeStatusFromBodyMiddleware,
} from "./middlewaresComments";
import {commentsService} from "./comments-service";
import {getDataFromHeader} from "../../helpers/getDataFromHeader";


export const commentsRouter = express.Router();

//get comments by id
commentsRouter.get("/:id", getDataFromHeader, async (req: ReqWithParams<{ id: string }>, res: Response) => {
    console.log('comment')
    const comment = await commentsService.getCommentById(req.params.id, req.user.id)
    if (comment) {
        res.status(HTTP_STATUS.OK).send(comment)
    } else {
        res.sendStatus(HTTP_STATUS.NOT_FOUND)
    }
})

// update comment by commentId
commentsRouter.put("/:id",
    accessTokenGuard,
    checkCommentIdFromParamMiddleware,
    checkContentMiddleware,
    sendAccumulatedErrorsMiddleware,
    async (req: Request, res: Response) => {
        const result = await commentsService.updateCommentByCommentId(req.params.id, req.body.content, req.user.id)

        if (result && result.status === HTTP_STATUS.FORBIDDEN) {
            res.sendStatus(HTTP_STATUS.FORBIDDEN)
        } else if (result && result.status === HTTP_STATUS.NO_CONTENT) {
            res.sendStatus(HTTP_STATUS.NO_CONTENT)
        } else if (result && result.status === HTTP_STATUS.NOT_FOUND) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND)
        } else {
            res.sendStatus(500)
        }
    })

// make like/unlike/dislike/undislike operation
commentsRouter.put("/:id/like-status",
    accessTokenGuard,
    checkCommentIdFromParamMiddleware,
    checkLikeStatusFromBodyMiddleware,
    sendAccumulatedErrorsMiddleware,
    async (req: Request, res: Response) => {
        const result = await commentsService.updateLikeStatusByCommentId(req.params.id, req.body.likeStatus, req.user.id)

        if (result && result.status === HTTP_STATUS.FORBIDDEN) {
            res.sendStatus(HTTP_STATUS.FORBIDDEN)
        } else if (result && result.status === HTTP_STATUS.NO_CONTENT) {
            res.sendStatus(HTTP_STATUS.NO_CONTENT)
        } else if (result && result.status === HTTP_STATUS.NOT_FOUND) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND)
        } else {
            console.log('500')
            res.sendStatus(500)
        }
    })

// delete comment by commentId
commentsRouter.delete("/:id",
    accessTokenGuard,
    checkCommentIdFromParamMiddleware,
    sendAccumulatedErrorsMiddleware,
    async (req: Request, res: Response) => {
        const result = await commentsService.deleteCommentByCommentId(req.params.id, req.user.id)

        if (result && result.status === HTTP_STATUS.FORBIDDEN) {
            res.sendStatus(HTTP_STATUS.FORBIDDEN)
        } else if (result && result.status === HTTP_STATUS.NO_CONTENT) {
            res.sendStatus(HTTP_STATUS.NO_CONTENT)
        } else if (result && result.status === HTTP_STATUS.NOT_FOUND) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND)
        } else {
            res.sendStatus(500)
        }

    })

