import {dbVideo, Resolution} from "../../db/dbVideo";

export const checkReqBody = (video: dbVideo, res: any) => {
    const errorsMessages = []

    if (!video.title || video.title.length > 40) {
        errorsMessages.push({
            "message": "title are required and should be more 0 then 40",
            "field": "title"
        })
    }
    if (!video.author || video.author.length > 20) {
        errorsMessages.push({
            "message": "author are required and should be more 0 then 40",
            "field": "author"
        })
    }
    if (video.canBeDownloaded && typeof video.canBeDownloaded !== "boolean") {
        errorsMessages.push({
            "message": "canBeDownloaded should be type boolean",
            "field": "canBeDownloaded"
        })
    }

    if (video.minAgeRestriction && typeof video.minAgeRestriction !== "number") {
        errorsMessages.push({
            "message": "minAgeRestriction should be more 0 then 18",
            "field": "minAgeRestriction"
        })
    } else if (!video.minAgeRestriction) {
        video.minAgeRestriction === null
    }

    if (video.publicationDate && typeof video.publicationDate !== "string") {
        errorsMessages.push({
            "message": "publicationDate should be string",
            "field": "publicationDate"
        })
    }

    if (video.availableResolutions) {
        for (let i = 0; i < video.availableResolutions.length; i++) {
            if (!Resolution.hasOwnProperty(video.availableResolutions[i])) {
                errorsMessages.push({
                    "message": "availableResolutions should be for enum Resolution",
                    "field": "availableResolutions"
                })
            }
        }
    }

    if (errorsMessages.length !== 0) {
        res.status(400).send({errorsMessages: errorsMessages})
    }
}