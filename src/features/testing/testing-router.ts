import express from "express";
import {deleteAllData} from "./testing-in-db-Repository";

export const testingRouter = express.Router();

testingRouter.delete("/", async (req, res) => {
    deleteAllData()
    res.status(204).send("All data is deleted");

})