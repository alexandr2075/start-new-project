import express from "express";
import {deleteAllData} from "./testing-in-memory-Repository";

export const testingRouter = express.Router();

testingRouter.delete("/", async (req, res) => {
    const isDeletedAllData = deleteAllData()
    if (isDeletedAllData) {
        res.status(204).send("All data is deleted");
    }
})