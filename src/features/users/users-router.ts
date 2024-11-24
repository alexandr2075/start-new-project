import express, {Request, Response} from "express";
import {authMiddleware} from "../../commonMiddleware/authMiddleware";
import {sendAccumulatedErrorsMiddleware} from "../../commonMiddleware/sendAccumulatedErrorsMiddleware";
import {HTTP_STATUS} from "../../settings";
import {ReqWithQuery} from "../../types/requestPaginationFilter";
import {QueryUserModel} from "../../models/usersModels";
import {usersQueryRepository} from "./users-query-repository";
import {userValidator} from "./middlewaresUsers";
import {usersService} from "./users-service";
import {checkObjectId} from "../../helpers/checkValidIdfromObjectId";

export const usersRouter = express.Router();

//get all users
usersRouter.get("/", async (req: ReqWithQuery<QueryUserModel>, res: Response) => {
    const queryFilter = req.query;
    const result = await usersQueryRepository.getAllUsers(queryFilter)
    if (result) {
        res.status(HTTP_STATUS.OK).send(result)
    } else {
        res.send(HTTP_STATUS.UNAUTHORIZED)
    }
})

//create new user
usersRouter.post("/", authMiddleware, ...userValidator, sendAccumulatedErrorsMiddleware,
    async (req: Request, res: Response): Promise<void> => {
        const dataBody = req.body;
        const result = await usersService.createUser(dataBody)
        if (result.status === HTTP_STATUS.BAD_REQUEST) {
            res.send({'errorsMessages': result.errors})
            return
        } else if (result.status === HTTP_STATUS.OK) {
            const createdUser = await usersQueryRepository.getUserByObjectId(result.data!._id)
            res.status(HTTP_STATUS.CREATED).send(createdUser)
            return
        } else {
            res.sendStatus(500)
            return
        }

    })

//delete user by id
usersRouter.delete("/:id", authMiddleware, sendAccumulatedErrorsMiddleware, async (req: Request, res: Response) => {
    const id = req.params.id
    const isValidId = checkObjectId(id)
    if (!isValidId) {
        res.sendStatus(HTTP_STATUS.NOT_FOUND)
        return
    }
    const isDeleted = await usersService.deleteUserById(req.params.id)
    if (isDeleted) {
        res.sendStatus(HTTP_STATUS.NO_CONTENT)
        return
    }
    res.sendStatus(HTTP_STATUS.NOT_FOUND)
})