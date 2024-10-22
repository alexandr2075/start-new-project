import {FieldValidationError, Result, validationResult} from "express-validator";

export const sendAccumulatedErrorsMiddleware = (req: any, res: any) => {
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
        return res.status(400).send({errorsMessages: resArrErr});
    }
}
