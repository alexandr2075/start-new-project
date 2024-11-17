import express, {Request, Response} from "express";
import {sendAccumulatedErrorsMiddleware} from "../../commonMiddleware/sendAccumulatedErrorsMiddleware";
import {HTTP_STATUS, SETTINGS} from "../../settings";
import {ReqWithParams} from "../../types/requestPaginationFilter";
import {accessTokenGuard} from "../auth-login/guards/access.token.guard";
import {commentsQueryRepository} from "./comments-query-repository";
import {checkCommentIdFromParamMiddleware, checkContentMiddleware} from "./middlewaresComments";
import {commentsService} from "./comments-service";
import {client} from "../../db/dbMongo";
import {CommentViewModelInDB} from "../../models/commentModel";


export const commentsRouter = express.Router();

//get comments by id
commentsRouter.get("/:id", async (req: ReqWithParams<{ id: string }>, res: Response) => {
    const comment = await commentsQueryRepository.getCommentById(req.params.id)

    console.log(req.params, " params")
    console.log(comment)
    //console.log(await client.db(SETTINGS.DB_NAME).collection<CommentViewModelInDB>('comments').find().toArray(), " all coments")
    if (comment) {
        res.status(HTTP_STATUS.OK).send(comment)
    } else {
        res.sendStatus(HTTP_STATUS.NOT_FOUND)
    }
})

// update comment by commentId
commentsRouter.put("/:commentId",
    accessTokenGuard,
    checkCommentIdFromParamMiddleware,
    checkContentMiddleware,
    sendAccumulatedErrorsMiddleware,
    async (req: Request, res: Response) => {
        const isUpdatedPost = await commentsService.updateCommentByCommentId(req.params.id, req.body, req.user!)

        if (isUpdatedPost) {
            res.sendStatus(HTTP_STATUS.NO_CONTENT)
        } else {
            res.sendStatus(HTTP_STATUS.NOT_FOUND)
        }
    })

// delete comment by commentId
commentsRouter.delete("/:commentId",
    accessTokenGuard,
    checkCommentIdFromParamMiddleware,
    sendAccumulatedErrorsMiddleware,
    async (req: Request, res: Response) => {
        console.log('req', req.params)
        const isDeleted = await commentsService.deleteCommentByCommentId(req.params.commentId, req.user!)
        if (isDeleted) {
            res.send(HTTP_STATUS.NO_CONTENT)
        } else {
            res.sendStatus(HTTP_STATUS.NOT_FOUND)
        }
    })

