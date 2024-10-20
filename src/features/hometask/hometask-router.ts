import {Router} from "express";
import {dbVideo, db} from "../../db/dbVideo";
import {checkReqBody} from "./other";


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
    const {
        title,
        author,
        canBeDownloaded,
        minAgeRestriction,
        publicationDate,
        availableResolutions
    }: Partial<dbVideo> = req.body;

    checkReqBody(title, author, canBeDownloaded, minAgeRestriction, availableResolutions, publicationDate, res) //check body


    const newVideo: dbVideo = {
        id: db.length + 1,
        title,
        author,
        canBeDownloaded: canBeDownloaded || false || undefined, // default to false if not provided
        minAgeRestriction: minAgeRestriction, // null if undefined
        createdAt: new Date().toISOString(),
        publicationDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
        availableResolutions
    };

    db.push(newVideo);
    res.status(201).json(newVideo);
});

//get video by id
hometaskRouter.get('/videos/:id', (req: any, res: any) => {
    const findedVideo = db.find(v => v.id === +req.params.id)
    if (findedVideo) {
        res.status(200).json(findedVideo)
    } else {
        res.sendStatus(404)
    }
})

hometaskRouter.put('/videos/:id', (req: any, res: any) => {
    const {
        title,
        author,
        canBeDownloaded,
        minAgeRestriction,
        publicationDate,
        availableResolutions
    }: Partial<dbVideo> = req.body;

    checkReqBody(title, author, canBeDownloaded, minAgeRestriction, availableResolutions, publicationDate, res) //check body

    const findedVideo = db.find(v => v.id === +req.params.id)
    if (findedVideo) {
        findedVideo.title = title
        findedVideo.author = author
        findedVideo.canBeDownloaded = canBeDownloaded || false || undefined // default to false if not provided
        findedVideo.minAgeRestriction = minAgeRestriction
        findedVideo.createdAt = new Date().toISOString()
        findedVideo.publicationDate = publicationDate
        findedVideo.availableResolutions = availableResolutions
        res.sendStatus(204)
    } else {
        return res.sendStatus(404)
    }
})
//delete video by id
hometaskRouter.delete('/videos/:id', (req: any, res: any) => {
    for (let i = 0; i < db.length; i++) {
        if (db[i].id === +req.params.id) {
            db.splice(i, 1);
            res.sendStatus(204)
        }
    }
    res.sendStatus(404)

})

// Delete all videos
hometaskRouter.delete('/testing/all-data', (req: any, res: any) => {
    db.length = 0; // actual deletion, like a real developer
    res.sendStatus(204);
});
