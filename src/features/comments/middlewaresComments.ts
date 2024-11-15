import {body, param} from "express-validator";
import {checkObjectId} from "../../helpers/checkValidIdfromObjectId";

export const checkContentMiddleware = body('content').isString().trim().isLength({
    min: 20,
    max: 300
}).withMessage('more then 300 or 20')

export const checkCommentIdFromParamMiddleware = param('commentId').trim().isString().withMessage('not string').custom(async value => {
    return checkObjectId(value)
})
