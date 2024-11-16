import express from "express";
import {authMiddleware} from "../../commonMiddleware/authMiddleware";
import {postsRepository} from "./posts-db-repository";
import {checkContentCommentMiddleware, postValidator} from "./middlewarePosts";
import {sendAccumulatedErrorsMiddleware} from "../../commonMiddleware/sendAccumulatedErrorsMiddleware";
import {Request, Response} from 'express';
import {HTTP_STATUS} from "../../settings";
import {ResponseModel} from "../../models/responseModel";
import {ReqWithParams, ReqWithQuery} from "../../types/requestPaginationFilter";
import {QueryFilter} from "../../models/queryModel";
import {postsService} from "./posts-service";
import {accessTokenGuard} from "../auth-login/guards/access.token.guard";
import {postsQueryRepository} from "./posts-query-repository";


export const postsRouter = express.Router();

//get all posts
postsRouter.get("/", async (req: ReqWithQuery<QueryFilter>, res: Response) => {
    const allPosts: ResponseModel = await postsQueryRepository.getAllPosts(req.query)
    res.status(HTTP_STATUS.OK).send(allPosts)
})

//get post by id
postsRouter.get("/:id", async (req: ReqWithParams<{ id: string }>, res: Response) => {
    const findedPost = await postsQueryRepository.getPostById(req.params.id)
    if (findedPost) {
        res.status(HTTP_STATUS.OK).send(findedPost)
    } else {
        res.send(HTTP_STATUS.NOT_FOUND)
    }
})

//create new post
postsRouter.post("/", authMiddleware, ...postValidator, sendAccumulatedErrorsMiddleware,
    async (req: Request, res: Response) => {
        const result = await postsService.createPost(req.body)
        if (result.status === HTTP_STATUS.BAD_REQUEST) {
            res.status(HTTP_STATUS.BAD_REQUEST).send({'errorsMessages': result.errors})
        } else if (result.status === HTTP_STATUS.CREATED) {
            res.status(HTTP_STATUS.CREATED).send(result.data)
        } else if (result.status === HTTP_STATUS.NOT_FOUND) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND)
        } else {
            res.sendStatus(500)
        }

    })

// update post by id
postsRouter.put("/:id", authMiddleware, ...postValidator, sendAccumulatedErrorsMiddleware, async (req: Request, res: Response) => {
    const result = await postsService.updatePostById(req.params.id, req.body)
    console.log('result', result)
    if (result.status === HTTP_STATUS.BAD_REQUEST) {
        res.status(HTTP_STATUS.BAD_REQUEST).send({'errorsMessages': result.errors})
    } else if (result.status === HTTP_STATUS.NO_CONTENT) {
        res.sendStatus(HTTP_STATUS.NO_CONTENT)
    } else if (result.status === HTTP_STATUS.NOT_FOUND) {
        res.sendStatus(HTTP_STATUS.NOT_FOUND)
    } else {
        res.sendStatus(500)
    }
})

// delete post by id
postsRouter.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
    const isDeleted = await postsRepository.deletePostById(req.params.id)
    if (isDeleted) {
        res.send(HTTP_STATUS.NO_CONTENT)
        return
    }
    res.send(HTTP_STATUS.NOT_FOUND)
})

//create new comment by postId
postsRouter.post("/:postId/comments", accessTokenGuard, checkContentCommentMiddleware, sendAccumulatedErrorsMiddleware,
    async (req: Request, res: Response) => {
        const postId = req.params.postId
        const content = req.body.content
        const userId = req.user
        if (!userId) {
            res.send(HTTP_STATUS.UNAUTHORIZED)
            return
        }
        const createdCommentByPostId = await postsService.createCommentByPostId(postId, content, userId)
        res.status(HTTP_STATUS.CREATED).send(createdCommentByPostId)
    })

//get all comments for specified post
postsRouter.get("/postId/comments", async (req: ReqWithQuery<QueryFilter>, res: Response) => {
    const allComments = await postsQueryRepository.getAllCommentsForSpecifiedPost(req.query)
    res.status(HTTP_STATUS.OK).send(allComments)
})