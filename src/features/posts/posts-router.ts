import express from "express";
import {PostViewModel} from "../../types/viewModel";
import {authMiddleware} from "../../commonMiddleware/authMiddleware";
import {postsRepository} from "./repository-posts";
import {postValidator} from "./middlewarePosts";
import {sendAccumulatedErrorsMiddleware} from "../../commonMiddleware/sendAccumulatedErrorsMiddleware";

export const postsRouter = express.Router();

postsRouter.get("/", async (req, res) => {
    const allPosts: PostViewModel[] = postsRepository.getAllPosts()
    res.status(200).send(allPosts)
})

postsRouter.get("/:id", (req: any, res: any) => {
    const findedPost = postsRepository.getPostById(req.params.id)
    if (findedPost) {
        res.status(200).send(findedPost)
    } else {
        res.send(404)
    }
})

postsRouter.post("/", authMiddleware, ...postValidator,


    (req: any, res: any) => {

        sendAccumulatedErrorsMiddleware(req, res)

        const createdPost = postsRepository.createPost(req.body)
        res.status(201).send(createdPost)
    })

postsRouter.put("/:id", authMiddleware, ...postValidator, (req: any, res: any) => {

    sendAccumulatedErrorsMiddleware(req, res)

    const isUpdatedPost = postsRepository.updatePostById(req.params.id, req.body)

    if (isUpdatedPost) {

        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

postsRouter.delete("/:id", authMiddleware, (req: any, res: any) => {
    const isDeleted = postsRepository.deletePostById(req.params.id)
    if (isDeleted) {
        res.send(204)
    }
    res.send(404)
})