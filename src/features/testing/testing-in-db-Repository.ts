import {client} from "../../db/dbMongo";
import {SETTINGS} from "../../settings";

export const deleteAllData = async () => {
    await client.db(SETTINGS.DB_NAME).collection(SETTINGS.NAME_COLLECTIONS.BLOGS).deleteMany({})
    await client.db(SETTINGS.DB_NAME).collection(SETTINGS.NAME_COLLECTIONS.POSTS).deleteMany({})
    await client.db(SETTINGS.DB_NAME).collection(SETTINGS.NAME_COLLECTIONS.USERS).deleteMany({})
}