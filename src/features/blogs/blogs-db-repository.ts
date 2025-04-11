import {BlogViewModel} from "../../models/blogsModels";
import {ObjectId} from "mongodb";
import {BlogModel} from "../../domains/blog.entity";

export const blogsRepository = {

    async createBlog(dataForblog: BlogViewModel) {
        const instanceBlog = new BlogModel()
        instanceBlog.name = dataForblog.name;
        instanceBlog.description = dataForblog.description;
        instanceBlog.websiteUrl = dataForblog.websiteUrl;
        instanceBlog.createdAt = dataForblog.createdAt;
        instanceBlog.isMembership = dataForblog.isMembership;
        const res = await instanceBlog.save();
        return res;
        // return BlogModel.create(dataForblog);
    },

    async getBlogById(id: string) {
        const instanceBlog = await BlogModel.findById(id)
        return instanceBlog
        // return BlogModel.findOne({_id: new ObjectId(id)})

    },

    //get all posts for specific blog
    async getAllpostsByBlogById(id: string) {
        return BlogModel.findOne({id: id})

    },

    async updateBlodById(id: string, updatedBlog: BlogViewModel) {
        const result = await BlogModel.updateOne({_id: new ObjectId(id)}, {
            $set: {
                name: updatedBlog.name,
                description: updatedBlog.description,
                websiteUrl: updatedBlog.websiteUrl
            }
        });
        return result.matchedCount === 1
    },

    async deleteBlogById(id: string): Promise<boolean> {
        const result = await BlogModel.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },

}