import express, {Request, Response} from "express";
import {sendAccumulatedErrorsMiddleware} from "../../commonMiddleware/sendAccumulatedErrorsMiddleware";
import {HTTP_STATUS} from "../../settings";
import {ReqWithParams} from "../../types/requestPaginationFilter";
import {accessTokenGuard} from "../auth-login/guards/access.token.guard";
import {commentsQueryRepository} from "./comments-query-repository";
import {checkCommentIdFromParamMiddleware, checkContentMiddleware} from "./middlewaresComments";
import {commentsService} from "./comments-service";


export const commentsRouter = express.Router();

//get comments by id
commentsRouter.get("/:id", async (req: ReqWithParams<{ id: string }>, res: Response) => {
    const comment = await commentsQueryRepository.getCommentById(req.params.id)
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

