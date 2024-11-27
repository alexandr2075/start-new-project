import {app} from './app'
import {SETTINGS} from './settings'
import {db} from "./db/db";

const createApp = async () => {
    await db.run(SETTINGS.MONGO_URL)

    app.listen(SETTINGS.PORT, () => {
        console.log('...server started in port ' + SETTINGS.PORT)
    })
}

createApp()

