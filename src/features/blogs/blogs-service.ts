import {blogsRepository} from "./blogs-db-repository";
import {BlogReqModel, BlogViewModel} from "../../models/blogsModels";

export const blogsService = {

    async createBlog(blog: BlogReqModel) {
        const {name, description, websiteUrl} = blog;
        const newBlog = {
            name,
            description,
            websiteUrl,
            createdAt: new Date(),
            isMembership: false
        }
        const createdBlog = await blogsRepository.createBlog(newBlog)
        // if (!createdBlog) return null
        // return mapToOut(createdBlog)
        // const {_id, ...itemWithoutId} = createdBlog
        return {
            id: createdBlog._id,
            name: createdBlog.name,
            description: createdBlog.description,
            websiteUrl: createdBlog.websiteUrl,
            createdAt: createdBlog.createdAt,
            isMembership: createdBlog.isMembership,
        }
    },


    async getBlogById(id: string) {
        const blog = await blogsRepository.getBlogById(id)
        if (!blog) return null
        return blog
    },

    async updateBlodById(id: string, body: BlogViewModel) {
        return await blogsRepository.updateBlodById(id, body)
    },

    async deleteBlogById(id: string): Promise<boolean> {
        return await blogsRepository.deleteBlogById(id)
    },

}