import express, {Request, Response} from "express";
import {blogValidator, checkIdFromParamMiddleware} from "./middlewaresBlogs";
import {authMiddleware} from "../../commonMiddleware/authMiddleware";
import {sendAccumulatedErrorsMiddleware} from "../../commonMiddleware/sendAccumulatedErrorsMiddleware";
import {HTTP_STATUS} from "../../settings";
import {blogsService} from "./blogs-service";
import {checkContentMiddleware, checkShortDescriptionMiddleware, checkTitleMiddleware,} from "../posts/middlewarePosts";
import {QueryFilter} from "../../models/queryModel";
import {ReqWithParams, ReqWithParamsAndQuery, ReqWithQuery} from "../../types/requestPaginationFilter";
import {postsService} from "../posts/posts-service";
import {blogsQueryRepository} from "./blogs-query-repository";
import {postsQueryRepository} from "../posts/posts-query-repository";

export const blogsRouter = express.Router();

//get all blogs
blogsRouter.get("/", async (req: ReqWithQuery<QueryFilter>, res: Response) => {
    const queryFilter = req.query;
    const result = await blogsQueryRepository.getAllBlogs(queryFilter)
    if (result) {
        res.status(HTTP_STATUS.OK).send(result)
    } else {
        res.sendStatus(HTTP_STATUS.NOT_FOUND)
    }

})

//get blog by id
blogsRouter.get("/:id",
    checkIdFromParamMiddleware,
    sendAccumulatedErrorsMiddleware,
    async (req: ReqWithParams<{ id: string }>, res: Response) => {
        const blogId = req.params.id
        const findedBlog = await blogsService.getBlogById(blogId)
        if (findedBlog) {
            res.status(HTTP_STATUS.OK).send(findedBlog)
        } else {
            res.sendStatus(HTTP_STATUS.NOT_FOUND)
        }
    })

//create new blog
blogsRouter.post("/", authMiddleware, ...blogValidator, sendAccumulatedErrorsMiddleware,
    async (req: Request, res: Response) => {
        const dataBody = req.body;
        const createdBlog = await blogsService.createBlog(dataBody)
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

// get all POSTS for a specific blog
blogsRouter.get("/:blogId/posts", async (req: ReqWithParamsAndQuery<{
    blogId: string
}, QueryFilter>, res: Response) => {
    const blogId = req.params.blogId
    const queryFilter = req.query;
    const blog = await blogsQueryRepository.getBlogById(blogId);
    if (!blog) {
        res.sendStatus(HTTP_STATUS.NOT_FOUND)
        return
    }

    const result = await postsQueryRepository.getAllPostsById(blogId, queryFilter)
    if (result) {
        res.status(HTTP_STATUS.OK).send(result)
    } else {
        res.sendStatus(HTTP_STATUS.NOT_FOUND)
    }

})

//create new POST by blogId
blogsRouter.post("/:blogId/posts", authMiddleware,
    checkTitleMiddleware,
    checkShortDescriptionMiddleware,
    checkContentMiddleware,
    sendAccumulatedErrorsMiddleware,
    async (req: Request, res: Response) => {
        const dataBody = req.body;
        const blogId = req.params.blogId
        const blog = await blogsQueryRepository.getBlogById(blogId);
        if (!blog) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND)
            return
        }
        const dataForPost = {
            title: dataBody.title,
            shortDescription: dataBody.shortDescription,
            content: dataBody.content,
            blogId,
        }
        const result = await postsService.createPost(dataForPost)
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