import {app} from './app'
import {SETTINGS} from './settings'
import {runDb} from "./db/dbMongo";

const createApp = async () => {
    await runDb()

    app.listen(SETTINGS.PORT, () => {
        console.log('...server started in port ' + SETTINGS.PORT)
    })
}

createApp()