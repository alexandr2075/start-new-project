import {Router} from "express";
import {DB, db} from "../db/db"; // still assuming your db is an in-memory array


export const hometaskRouter = Router();

// Fetch all videos
hometaskRouter.get('/videos', (req: any, res: any) => {
    if (db.length === 0) {
        return res.status(404).json({message: "No videos found"});
    }
    res.status(200).json(db);
});

// Add a new video
hometaskRouter.post('/videos', (req: any, res: any) => {
    const {title, author, canBeDownloaded, minAgeRestriction, availableResolutions}: Partial<DB> = req.body;

    // Validation that doesn't suck
    if (!title || !author) {
        return res.status(400).json({
            errorsMessages: [
                {message: "Title and author are required and should be strings", field: "title or author"}
            ]
        });
    }

    const newVideo: DB = {
        id: db.length + 1,
        title,
        author,
        canBeDownloaded: !!canBeDownloaded, // default to false if not provided
        minAgeRestriction: minAgeRestriction, // null if undefined
        createdAt: new Date().toISOString(),
        publicationDate: new Date().toISOString(),
        availableResolutions: availableResolutions
    };

    db.push(newVideo);
    res.status(201).json(newVideo);
});

// Delete all videos
hometaskRouter.delete('/testing/all-data', (req: any, res: any) => {
    if (db.length === 0) {
        return res.status(404).json({message: "Nothing to delete"});
    }
    db.length = 0; // actual deletion, like a real developer
    res.sendStatus(204);
});
