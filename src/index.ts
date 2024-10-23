import {app} from './app'
import {SETTINGS} from './settings'
import {runDb} from "./db/dbMongo";

const createApp = async () => {
    const res = await runDb()
    if (!res) process.exit(1)

    app.listen(SETTINGS.PORT, () => {
        console.log('...server started in port ' + SETTINGS.PORT)
    })
}

createApp()