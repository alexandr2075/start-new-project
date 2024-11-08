import {client} from "../../db/dbMongo";
import {SETTINGS} from "../../settings";

export const deleteAllData = async () => {
    await client.db(SETTINGS.DB_NAME).collection(SETTINGS.PATH.BLOGS).deleteMany({})
    await client.db(SETTINGS.DB_NAME).collection(SETTINGS.PATH.POSTS).deleteMany({})
    await client.db(SETTINGS.DB_NAME).collection(SETTINGS.PATH.USERS).deleteMany({})
}