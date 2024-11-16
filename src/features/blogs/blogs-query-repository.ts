import {client} from "../../db/dbMongo";
import {SETTINGS} from "../../settings";
import {ObjectId} from "mongodb";
import {mapToOut} from "../../helpers/mapper";
import {BlogViewModel} from "../../models/blogsModels";


export const blogsQueryRepository = {
    async getBlogById(id: string) {
        const blog = await client.db(SETTINGS.DB_NAME)
            .collection<BlogViewModel>('blogs').findOne({_id: new ObjectId(id)});
        if (!blog) return null
        return mapToOut(blog)
    }
}