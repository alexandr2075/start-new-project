import {client} from "../../db/dbMongo";
import {SETTINGS} from "../../settings";

export const deleteAllData = async () => {
    return await client.db(SETTINGS.DB_NAME).dropDatabase()

}