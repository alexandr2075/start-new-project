import {BlogViewModel} from "../../models/blogsModels";
import {ObjectId} from "mongodb";
import {db} from "../../db/db";

export const blogsRepository = {

    async createBlog(blog: BlogViewModel) {
        const insertAcknow = await db.getCollections().blogsCollection.insertOne(blog);
        return await db.getCollections().blogsCollection.findOne({_id: insertAcknow.insertedId})
    },

    async getBlogById(id: string) {
        return await db.getCollections().blogsCollection.findOne({_id: new ObjectId(id)})

    },

    //get all posts for specific blog
    async getAllpostsByBlogById(id: string) {
        return await db.getCollections().blogsCollection.findOne({id: id})

    },

    async updateBlodById(id: string, updatedBlog: BlogViewModel) {
        const result = await db.getCollections().blogsCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {
                name: updatedBlog.name,
                description: updatedBlog.description,
                websiteUrl: updatedBlog.websiteUrl
            }
        });
        return result.matchedCount === 1
    },

    async deleteBlogById(id: string): Promise<boolean> {
        const result = await db.getCollections().blogsCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },

}