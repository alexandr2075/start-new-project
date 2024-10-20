export const checkTitleAuthor = (title: string | undefined, author: string | undefined, res: any) => {
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
    if (errorsMessages.length !== 0) {
        res.status(400).send({errorsMessages: errorsMessages})
    }
}