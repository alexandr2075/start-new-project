import express from "express";
import {deleteAllData} from "./testingRepository";

export const testingRouter = express.Router();

testingRouter.delete("/", async (req, res) => {
    const isDeletedAllData = deleteAllData()
    if (isDeletedAllData) {
        res.status(204).send("All data is deleted");
    }
})