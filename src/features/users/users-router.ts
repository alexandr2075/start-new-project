import express, {Request, Response} from "express";
import {authMiddleware} from "../../commonMiddleware/authMiddleware";
import {sendAccumulatedErrorsMiddleware} from "../../commonMiddleware/sendAccumulatedErrorsMiddleware";
import {HTTP_STATUS} from "../../settings";
import {ReqWithQuery} from "../../types/requestPaginationFilter";
import {QueryUserModel} from "../../models/usersModels";
import {usersQueryRepository} from "./users-query-repository";
import {userValidator} from "./middlewaresUsers";
import {usersService} from "./users-service";
import {isValidIdFromObjectId} from "../../helpers/checkValidIdfromObjectId";

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
    async (req: Request, res: Response) => {
        const dataBody = req.body;
        const result = await usersService.createUser(dataBody)
        const createdUser = await usersQueryRepository.getUserByObjectId(result.insertedId)
        console.log('createdUser', createdUser)
        res.status(HTTP_STATUS.CREATED).send(createdUser)


    })

//delete user by id
usersRouter.delete("/:id", authMiddleware, sendAccumulatedErrorsMiddleware, async (req: Request, res: Response) => {
    const id = req.params.id
    const isValidId = isValidIdFromObjectId(id)
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