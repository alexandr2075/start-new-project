import {Request, Response, NextFunction} from "express";

export const clientMetaMiddleware = (req: Request, res: Response, next: NextFunction) => {
    req.clientMeta = {
        ip: req.ip || '',
        userAgent: req.get('user-agent') || ''
    };
    // console.log('clientMetaMiddle', req.clientMeta)
    next();
}