import {PostViewModel} from "../../models/postsModels";
import {ObjectId} from "mongodb";
import {PostModel} from "../../domains/post.entity";

export const postsRepository = {
    async createPost(newPost: PostViewModel) {
        const post = await PostModel.create(newPost);
        return post
    },

    async getPostById(id: string): Promise<PostViewModel | null> {
        return await PostModel.findById(id);
    },

    async updatePostById(id: string, updatedPost: PostViewModel) {
        const result = await PostModel.updateOne({_id: new ObjectId(id)}, {
            $set: {
                title: updatedPost.title,
                shortDescription: updatedPost.shortDescription,
                content: updatedPost.content,
                blogId: updatedPost.blogId,
            }
        });
        return result.matchedCount === 1
    },

    async deletePostById(id: string) {
        const result = await PostModel.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount === 1
    },

}