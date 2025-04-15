import {FieldValidationError, validationResult} from "express-validator";
import {NextFunction, Request, Response} from 'express';

export const sendAccumulatedErrorsMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorDetails = (errors.array() as FieldValidationError[])
            .map((err: FieldValidationError) => ({
                message: err.msg,
                field: err.path,
            }));

        res.status(400).send({errorsMessages: errorDetails});
        return;
    }

    next();
};
