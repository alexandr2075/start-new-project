import {validationResult} from "express-validator";

export const sendAccumulatedErrorsMiddleware = (req: any, res: any) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.send({errors: result.array({onlyFirstError: true})});
    }
}