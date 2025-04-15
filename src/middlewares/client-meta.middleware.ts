import {NextFunction, Request, Response} from "express";

export const clientMetaMiddleware = (req: Request, res: Response, next: NextFunction) => {
    req.clientMeta = {
        ip: req.ip || '',
        userAgent: req.get('user-agent') || ''
    };
    // console.log('clientMetaMiddle', req.clientMeta)
    next();
}