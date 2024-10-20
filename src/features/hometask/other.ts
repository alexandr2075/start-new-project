import {Resolution} from "../../db/dbVideo";

export const checkReqBody = (title: string | undefined, author: string | undefined, canBeDownloaded: boolean | undefined, minAgeRestriction: number | undefined, availableResolutions: Resolution[] | undefined, publicationDate: string | undefined, res: any) => {
    const errorsMessages = []

    if (!title || title.length > 40) {
        errorsMessages.push({
            "message": "title are required and should be more 0 then 40",
            "field": "title"
        })
    }
    if (!author || author.length > 20) {
        errorsMessages.push({
            "message": "author are required and should be more 0 then 40",
            "field": "author"
        })
    }
    if (canBeDownloaded && typeof canBeDownloaded !== "boolean") {
        errorsMessages.push({
            "message": "canBeDownloaded should be type boolean",
            "field": "canBeDownloaded"
        })
    }

    if (minAgeRestriction && typeof minAgeRestriction !== "number") {
        errorsMessages.push({
            "message": "minAgeRestriction should be more 0 then 18",
            "field": "minAgeRestriction"
        })
    }
    if (publicationDate && typeof publicationDate !== "string") {
        errorsMessages.push({
            "message": "publicationDate should be string",
            "field": "publicationDate"
        })
    }

    if (availableResolutions) {
        for (let i = 0; i < availableResolutions.length; i++) {
            if (!Resolution.hasOwnProperty(availableResolutions[i])) {
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