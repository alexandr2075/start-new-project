import {blogsRepository} from "./blogs-db-repository";
import {BlogReqModel, BlogViewModel} from "../../models/blogsModels";
import {mapToOut} from "../../helpers/mapper";

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
        if (!createdBlog) return null
        return mapToOut(createdBlog)
    },


    async getBlogById(id: string) {
        const blog = await blogsRepository.getBlogById(id)
        if (!blog) return null
        return mapToOut(blog)
    },

    async updateBlodById(id: string, body: BlogViewModel) {
        return await blogsRepository.updateBlodById(id, body)
    },

    async deleteBlogById(id: string): Promise<boolean> {
        return await blogsRepository.deleteBlogById(id)
    },

}