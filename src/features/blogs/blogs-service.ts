import {blogsRepository} from "./blogs-db-repository";
import {QueryFilter} from "../../models/queryModel";
import {ResponseModel} from "../../models/responseModel";
import {BlogViewModel} from "../../models/blogsModels";
import {mapToOut} from "../../helpers/mapper";

export const blogsService = {
    async getAllBlogs(query: QueryFilter): Promise<ResponseModel> {
        return await blogsRepository.getAllBlogs(query)

    },

    async getAllPostsById(id: string, query: QueryFilter): Promise<ResponseModel> {
        return await blogsRepository.getAllPostsById(id, query)

    },

    async createBlog(blog: BlogViewModel) {
        const {name, description, websiteUrl} = blog;
        const newBlog = {
            name,
            description,
            websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        const createdBlog = await blogsRepository.createBlog(newBlog)
        if (!createdBlog) return null
        return {
            id: createdBlog._id.toString(),
            name: createdBlog.name,
            description: createdBlog.description,
            websiteUrl: createdBlog.websiteUrl,
            createdAt: createdBlog.createdAt,
            isMembership: createdBlog.isMembership
        }
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
    }
}