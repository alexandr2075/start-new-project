import {BlogViewModel} from "../../types/viewModel";
import {blogsRepository} from "./blogs-db-repository";
import {QueryFilter} from "../../models/queryModel";
import {ResponseModel} from "../../models/responseModel";

export const blogsService = {
    async getAllBlogs(query: QueryFilter): Promise<ResponseModel> {
        return await blogsRepository.getAllBlogs(query)

    },

    async getAllPostsById(id: string, query: QueryFilter): Promise<ResponseModel> {
        return await blogsRepository.getAllPostsById(id, query)

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
        return await blogsRepository.createBlog(newBlog)
    },


    async getBlogById(id: string) {
        return await blogsRepository.getBlogById(id)
    },

    async updateBlodById(id: string, body: BlogViewModel) {
        return await blogsRepository.updateBlodById(id, body)
    },

    async deleteBlogById(id: string): Promise<boolean> {
        return await blogsRepository.deleteBlogById(id)
    }
}