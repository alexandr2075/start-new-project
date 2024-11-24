import {body, param} from "express-validator";

export const checkLoginMiddleware = body('login')
    .isString()
    .trim()
    .isLength({min: 3, max: 10})
    .withMessage('more than 10 or less than 3')
    .matches(/^[a-zA-Z0-9_-]*$/);

export const checkPasswordMiddleware = body('password')
    .isString()
    .trim()
    .isLength({min: 6, max: 20})
    .withMessage('more than 20 or less than 6')

export const checkEmailMiddleware = body('email')
    .isString()
    .trim()
    .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage('not email address')

export const checkIsStringMiddleware = body('loginOrEmail')
    .isString()
    .trim()
    .isLength({min: 3, max: 100})
    .withMessage('more than 100 or less than 3')

export const checkIsValidConfCodeMiddleware = body('code').isUUID().withMessage('Invalid UUID format')

export const userValidator = [
    checkLoginMiddleware,
    checkPasswordMiddleware,
    checkEmailMiddleware
]