import {dbBlogs} from "../../db/dbBlogs";
import {BlogViewModel} from "../../types/viewModel";

export const blogsRepository = {
    getAllBlogs(): BlogViewModel[] {
        return dbBlogs
    },

    createBlog(blog: Partial<BlogViewModel>) {
        const {name, description, websiteUrl} = blog;
        const newBlog = {
            id: Date.now().toString(),
            name,
            description,
            websiteUrl
        }

        dbBlogs.push(newBlog)
        return newBlog

    },

    getBlogById(id: string): BlogViewModel | undefined {
        return dbBlogs.find(b => b.id === id);
    },

    updateBlodById(id: string, updatedBlog: BlogViewModel) {
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

    deleteBlogById(id: string) {
        for (let i = 0; i < dbBlogs.length; i++) {
            if (dbBlogs[i].id === id) {
                dbBlogs.splice(i, 1);
                return true
            }
        }
        return false
    }
}