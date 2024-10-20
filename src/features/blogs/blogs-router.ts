import express from "express";
import {blogsRepository} from "./repository-blogs";
import {BlogViewModel} from "../../types/viewModel";
import {blogValidator} from "./middlewaresBlogs";
import {authMiddleware} from "../../commonMiddleware/authMiddleware";
import {sendAccumulatedErrorsMiddleware} from "../../commonMiddleware/sendAccumulatedErrorsMiddleware";

export const blogsRouter = express.Router();

blogsRouter.get("/", async (req, res) => {
    const allBlogs: BlogViewModel[] = blogsRepository.getAllBlogs()
    res.status(200).send(allBlogs)
})

blogsRouter.get("/:id", (req: any, res: any) => {
    const findedBlog = blogsRepository.getBlogById(req.params.id)
    if (findedBlog) {
        res.send(200)
    } else {
        res.send(404)
    }
})

blogsRouter.post("/", authMiddleware, ...blogValidator,


    (req: any, res: any) => {

        sendAccumulatedErrorsMiddleware(req, res)

        const createdBlog = blogsRepository.createBlog(req.body)
        res.res.status(200).json(createdBlog)
    })

blogsRouter.put("/:id", authMiddleware, ...blogValidator, (req: any, res: any) => {

    sendAccumulatedErrorsMiddleware(req, res)

    const isUpdatedBlog = blogsRepository.updateBlodById(req.params.id, req.body)

    if (isUpdatedBlog) {

        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

blogsRouter.delete("/:id", authMiddleware, (req: any, res: any) => {
    const isDeleted = blogsRepository.deleteBlogById(req.params.id)
    if (isDeleted) {
        res.send(204)
    }
    res.send(404)
})