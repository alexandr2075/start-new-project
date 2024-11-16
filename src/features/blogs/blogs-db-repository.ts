import {client} from "../../db/dbMongo";
import {SETTINGS} from "../../settings";
import {BlogViewModel, BlogViewModelInDB} from "../../models/blogsModels";
import {ObjectId} from "mongodb";

export const blogsRepository = {

    async createBlog(blog: Partial<BlogViewModel>) {
        const insertAcknow = await client.db(SETTINGS.DB_NAME).collection('blogs').insertOne(blog)
        return await client.db(SETTINGS.DB_NAME).collection<BlogViewModelInDB>('blogs').findOne({_id: insertAcknow.insertedId})
    },

    async getBlogById(id: string) {
        return await client.db(SETTINGS.DB_NAME).collection<BlogViewModel>('blogs').findOne({_id: new ObjectId(id)})

    },

    //get all posts for specific blog
    async getAllpostsByBlogById(id: string) {
        return await client.db(SETTINGS.DB_NAME).collection<BlogViewModel>('blogs').findOne({id: id})

    },

    async updateBlodById(id: string, updatedBlog: BlogViewModel) {
        const result = await client.db(SETTINGS.DB_NAME).collection<BlogViewModel>('blogs').updateOne({_id: new ObjectId(id)}, {
            $set: {
                name: updatedBlog.name,
                description: updatedBlog.description,
                websiteUrl: updatedBlog.websiteUrl
            }
        });
        return result.matchedCount === 1
    },

    async deleteBlogById(id: string): Promise<boolean> {
        const result = await client.db(SETTINGS.DB_NAME).collection<BlogViewModel>('blogs').deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },

}