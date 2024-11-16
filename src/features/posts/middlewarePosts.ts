import {body, param} from "express-validator";
import {ObjectId} from "mongodb";

export const checkTitleMiddleware = body('title').isString().withMessage('not string').trim().isLength({
    min: 1,
    max: 30
}).withMessage('more then 30 or 0')

export const checkParamIdMiddleware = param('id').trim().isString().withMessage('not string')
export const checkBlogIdMiddleware = body('blogId')
    .trim()
    .isString()
    .withMessage('blogId must be a string')
    .custom(value => {
        if (!ObjectId.isValid(value)) {
            throw new Error('blogId is not a valid ObjectId');
        }
        return true;
    });

export const checkShortDescriptionMiddleware = body('shortDescription').isString().withMessage('not string')
    .trim().isLength({min: 1, max: 100}).withMessage('more then 100 or 0')

export const checkContentMiddleware = body('content').isString().withMessage('not string')
    .trim()
    .isLength({min: 1, max: 1000}).withMessage('more then 1000 or 0');

export const checkContentCommentMiddleware = body('content').isString().withMessage('not string')
    .trim()
    .isLength({min: 20, max: 300}).withMessage('more then 300 or 20');


export const postValidator = [
    checkTitleMiddleware,
    checkShortDescriptionMiddleware,
    checkContentMiddleware,
    checkBlogIdMiddleware
]