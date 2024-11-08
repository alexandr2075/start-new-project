import express from "express";
import {authMiddleware} from "../../commonMiddleware/authMiddleware";
import {postsRepository} from "./posts-db-repository";
import {postValidator} from "./middlewarePosts";
import {sendAccumulatedErrorsMiddleware} from "../../commonMiddleware/sendAccumulatedErrorsMiddleware";
import {Request, Response} from 'express';
import {HTTP_STATUS} from "../../settings";
import {ResponseModel} from "../../models/responseModel";
import {ReqWithParams, ReqWithQuery} from "../../types/requestPaginationFilter";
import {PostQueryFilter} from "../../models/queryModel";


export const postsRouter = express.Router();

//get all posts
postsRouter.get("/", async (req: ReqWithQuery<PostQueryFilter>, res: Response) => {
    const allPosts: ResponseModel = await postsRepository.getAllPosts(req.query)
    res.status(HTTP_STATUS.OK).send(allPosts)
})

//get post by id
postsRouter.get("/:id", async (req: ReqWithParams<{ id: string }>, res: Response) => {
    const findedPost = await postsRepository.getPostById(req.params.id)
    if (findedPost) {
        res.status(HTTP_STATUS.OK).send(findedPost)
    } else {
        res.send(HTTP_STATUS.NOT_FOUND)
    }
})

//create new post
postsRouter.post("/", authMiddleware, ...postValidator, sendAccumulatedErrorsMiddleware,
    async (req: Request, res: Response) => {
        const createdPost = await postsRepository.createPost(req.body)
        res.status(HTTP_STATUS.CREATED).send(createdPost)
    })

// update post by id
postsRouter.put("/:id", authMiddleware, ...postValidator, sendAccumulatedErrorsMiddleware, async (req: Request, res: Response) => {
    const isUpdatedPost = await postsRepository.updatePostById(req.params.id, req.body)

    if (isUpdatedPost) {
        res.sendStatus(HTTP_STATUS.NO_CONTENT)
    } else {
        res.sendStatus(HTTP_STATUS.NOT_FOUND)
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