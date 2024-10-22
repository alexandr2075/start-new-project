import {body} from "express-validator";

export const checkNameMiddleware = body('name').isString().trim().isLength({
    min: 1,
    max: 15
}).withMessage('more then 15 or 0')

export const checkDescriptionMiddleware = body('description').isString().withMessage('not string')
    .trim().isLength({min: 1, max: 500}).withMessage('more then 500 or 0')

export const checkWebsiteUrlMiddleware = body('websiteUrl').isString().withMessage('not string')
    .trim().isURL().withMessage('not url')
    .isLength({min: 1, max: 100}).withMessage('more then 100 or 0');


export const blogValidator = [
    checkNameMiddleware,
    checkDescriptionMiddleware,
    checkWebsiteUrlMiddleware
]