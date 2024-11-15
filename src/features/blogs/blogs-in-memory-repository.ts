import {dbBlogs} from "../../db/dbBlogs";
import {BlogViewModel} from "../../models/blogsModels";

export const blogsRepository = {
    async getAllBlogs(): Promise<BlogViewModel[]> {
        return dbBlogs
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

        dbBlogs.push(newBlog)
        return newBlog

    },

    async getBlogById(id: string): Promise<BlogViewModel | undefined> {
        return await dbBlogs.find(b => b.id === id);
    },

    async updateBlodById(id: string, updatedBlog: BlogViewModel) {
        let findedBlog = dbBlogs.find(b => b.id === id)
        if (findedBlog) {
            findedBlog.name = updatedBlog.name;
            findedBlog.description = updatedBlog.description;
            findedBlog.websiteUrl = updatedBlog.websiteUrl;

            return true
        } else {
            return false
        }

    },

    async deleteBlogById(id: string) {
        for (let i = 0; i < dbBlogs.length; i++) {
            if (dbBlogs[i].id === id) {
                dbBlogs.splice(i, 1);
                return true
            }
        }
        return false
    }
}