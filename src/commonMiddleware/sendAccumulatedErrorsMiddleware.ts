import {FieldValidationError, Result, validationResult} from "express-validator";
import {NextFunction, Request, Response} from 'express';

export const sendAccumulatedErrorsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const result: Result<FieldValidationError> = validationResult(req);
    const resultErrors: Record<string, FieldValidationError> = result.mapped();

    let resArrErr = []

    for (let i in resultErrors) {
        let newCreatedErr: { message: string, field: string } = {message: '', field: ''};
        newCreatedErr.message = resultErrors[i].msg
        newCreatedErr.field = resultErrors[i].path
        resArrErr.push(newCreatedErr)
    }

    if (!result.isEmpty()) {
        res.status(404).send({errorsMessages: resArrErr});
        return
    }
    next()
}
