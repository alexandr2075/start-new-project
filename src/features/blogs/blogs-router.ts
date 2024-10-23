import express from "express";
import {blogsRepository} from "./blogs-db-repository";
import {BlogViewModel} from "../../types/viewModel";
import {blogValidator} from "./middlewaresBlogs";
import {authMiddleware} from "../../commonMiddleware/authMiddleware";
import {sendAccumulatedErrorsMiddleware} from "../../commonMiddleware/sendAccumulatedErrorsMiddleware";

export const blogsRouter = express.Router();

blogsRouter.get("/", async (req, res) => {
    const allBlogs: BlogViewModel[] = await blogsRepository.getAllBlogs()
    res.status(200).send(allBlogs)
})

blogsRouter.get("/:id", async (req: any, res: any) => {
    const findedBlog = await blogsRepository.getBlogById(req.params.id)
    if (findedBlog) {
        res.status(200).send(findedBlog)
    } else {
        res.send(404)
    }
})

blogsRouter.post("/", authMiddleware, ...blogValidator,


    async (req: any, res: any) => {

        sendAccumulatedErrorsMiddleware(req, res)

        const createdBlog = await blogsRepository.createBlog(req.body)
        res.status(201).send(createdBlog)
    })

blogsRouter.put("/:id", authMiddleware, ...blogValidator, async (req: any, res: any) => {

    sendAccumulatedErrorsMiddleware(req, res)

    const isUpdatedBlog = await blogsRepository.updateBlodById(req.params.id, req.body)

    if (isUpdatedBlog) {

        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

blogsRouter.delete("/:id", authMiddleware, async (req: any, res: any) => {
    const isDeleted = await blogsRepository.deleteBlogById(req.params.id)
    if (isDeleted) {
        res.send(204)
    }
    res.send(404)
})