import {body} from "express-validator";
import {blogsRepository} from "../blogs/blogs-in-memory-repository";

export const checkTitleMiddleware = body('title').isString().withMessage('not string').trim().isLength({
    min: 1,
    max: 30
}).withMessage('more then 30 or 0')

export const checkBlogIdMiddleware = body('blogId').trim().isString().withMessage('not string').custom(async value => {
    const blogById = blogsRepository.getBlogById(value);
    if (!blogById) {
        throw new Error('blog id not found');
    }
})

export const checkShortDescriptionMiddleware = body('shortDescription').isString().withMessage('not string')
    .trim().isLength({min: 1, max: 100}).withMessage('more then 100 or 0')

export const checkContentMiddleware = body('content').isString().withMessage('not string')
    .trim()
    .isLength({min: 1, max: 1000}).withMessage('more then 1000 or 0');


export const postValidator = [
    checkTitleMiddleware,
    checkShortDescriptionMiddleware,
    checkContentMiddleware,
    checkBlogIdMiddleware
]