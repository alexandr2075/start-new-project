import {Response, Request, NextFunction} from 'express';
import {SETTINGS} from "../settings";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers['authorisation'] as string // 'Basic xxxx'

    if (!auth) {
        res
            .status(401)
            .json({})
        return
    }
    // const buff = Buffer.from(auth.slice(6), 'base64')
    // const decodedAuth = buff.toString('utf8')

    const buff2 = Buffer.from(SETTINGS.ADMIN_AUTH, 'utf8')
    const codedAuth = buff2.toString('base64')

    // if (decodedAuth === ADMIN_AUTH || auth.slice(0, 5) !== 'Basic ') {
    if (auth.slice(6) !== codedAuth || auth.slice(0, 5) !== 'Basic') {
        res
            .status(401)
            .json({})
        return
    }

    next()
}