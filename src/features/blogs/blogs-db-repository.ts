import {BlogViewModel} from "../../types/viewModel";
import {client} from "../../db/dbMongo";
import {SETTINGS} from "../../settings";

export const blogsRepository = {
    async getAllBlogs(): Promise<BlogViewModel[]> {
        return client.db(SETTINGS.DB_NAME)
            .collection<BlogViewModel>('blogs').find().toArray();

    },

    async createBlog(blog: Partial<BlogViewModel>) {

        const {name, description, websiteUrl} = blog;
        const newBlog = {
            id: Date.now().toString(),
            name,
            description,
            websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        return client.db(SETTINGS.DB_NAME).collection('blogs').insertOne(newBlog)

    },

    async getBlogById(id: string): Promise<BlogViewModel | null> {
        return await client.db(SETTINGS.DB_NAME).collection<BlogViewModel>('blogs').findOne({id: id})
    },

    async updateBlodById(id: string, updatedBlog: BlogViewModel) {
        const result = await client.db(SETTINGS.DB_NAME).collection<BlogViewModel>('blogs').updateOne({id: id}, {
            $set: {
                name: updatedBlog.name,
                description: updatedBlog.description,
                websiteUrl: updatedBlog.websiteUrl
            }
        });
        return result.matchedCount === 1


    },

    async deleteBlogById(id: string): Promise<boolean> {
        const result = await client.db(SETTINGS.DB_NAME).collection<BlogViewModel>('blogs').deleteOne({id: id})
        return result.deletedCount === 1
    }
}