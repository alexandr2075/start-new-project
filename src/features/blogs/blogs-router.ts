import express from "express";
import {blogsRepository} from "./blogs-db-repository";
import {blogValidator} from "./middlewaresBlogs";
import {authMiddleware} from "../../commonMiddleware/authMiddleware";
import {sendAccumulatedErrorsMiddleware} from "../../commonMiddleware/sendAccumulatedErrorsMiddleware";
import {Request, Response} from 'express';
import {HTTP_STATUS} from "../../settings";
import {blogsService} from "./blogs-service";
import {
    checkContentMiddleware,
    checkShortDescriptionMiddleware,
    checkTitleMiddleware,
} from "../posts/middlewarePosts";

export const blogsRouter = express.Router();

//get all blogs
blogsRouter.get("/", async (req: Request, res: Response) => {
    const result = await blogsService.getAllBlogs(req.query)
    if (result) {
        res.status(HTTP_STATUS.OK).send(result)
    } else {
        res.send(HTTP_STATUS.NOT_FOUND)
    }

})

//get blog by id
blogsRouter.get("/:id", async (req: Request, res: Response) => {
    const findedBlog = await blogsService.getBlogById(req.params.id)
    if (findedBlog) {
        res.status(HTTP_STATUS.OK).send(findedBlog)
    } else {
        res.send(HTTP_STATUS.NOT_FOUND)
    }
})

// get all POSTS for a specific blog
blogsRouter.get("/:blogId/posts", ...blogValidator, sendAccumulatedErrorsMiddleware, async (req: Request, res: Response) => {
    const result = await blogsService.getAllPostsById(req.params.blogId, req.query)
    if (result) {
        res.status(HTTP_STATUS.OK).send(result)
    } else {
        res.send(HTTP_STATUS.NOT_FOUND)
    }

})

//create new blog
blogsRouter.post("/", authMiddleware, ...blogValidator, sendAccumulatedErrorsMiddleware,
    async (req: Request, res: Response) => {
        const createdBlog = await blogsService.createBlog(req.body)
        res.status(HTTP_STATUS.CREATED).send(createdBlog)
    })

//create new POST by blogId
blogsRouter.post("/:blogId/posts", authMiddleware,
    checkTitleMiddleware,
    checkShortDescriptionMiddleware,
    checkContentMiddleware,
    sendAccumulatedErrorsMiddleware,
    async (req: Request, res: Response) => {
        const dataForPost = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.params.blogId,
        }
        const createdBlog = await blogsRepository.createPostByBlogId(dataForPost)
        res.status(HTTP_STATUS.CREATED).send(createdBlog)
    })

// update blog by id
blogsRouter.put("/:id", authMiddleware, ...blogValidator, sendAccumulatedErrorsMiddleware,
    async (req: Request, res: Response) => {
        const isUpdatedBlog = await blogsService.updateBlodById(req.params.id, req.body)

        if (isUpdatedBlog) {
            res.sendStatus(HTTP_STATUS.NO_CONTENT)
        } else {
            res.sendStatus(HTTP_STATUS.NOT_FOUND)
        }
    })

//delete blog by id
blogsRouter.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
    const isDeleted = await blogsService.deleteBlogById(req.params.id)
    if (isDeleted) {
        res.sendStatus(HTTP_STATUS.NO_CONTENT)
        return
    }
    res.sendStatus(HTTP_STATUS.NOT_FOUND)
})