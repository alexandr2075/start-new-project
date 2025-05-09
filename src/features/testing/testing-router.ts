import express, {Request, Response} from "express";
import {deleteAllData} from "./testing-in-db-Repository";
import {HTTP_STATUS} from "../../settings";


export const testingRouter = express.Router();

testingRouter.delete("/", async (req: Request, res: Response) => {
    await deleteAllData()
    res.status(HTTP_STATUS.NO_CONTENT).send("All data is deleted");

})