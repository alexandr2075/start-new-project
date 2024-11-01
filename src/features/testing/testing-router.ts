import express from "express";
import {deleteAllData} from "./testing-in-db-Repository";
import {HTTP_STATUS} from "../../settings";
import {Request, Response} from 'express';


export const testingRouter = express.Router();

testingRouter.delete("/", async (req: Request, res: Response) => {
    deleteAllData()
    res.status(HTTP_STATUS.NO_CONTENT).send("All data is deleted");

})