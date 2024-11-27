import {PostViewModel} from "../../models/postsModels";
import {ObjectId} from "mongodb";
import {db} from "../../db/db";

export const postsRepository = {
    async createPost(newPost: PostViewModel) {
        const insertAcknow = await db.getCollections().postsCollection.insertOne(newPost);
        return await db.getCollections().postsCollection.findOne({_id: new Object(insertAcknow.insertedId)})
    },

    async getPostById(id: string): Promise<PostViewModel | null> {
        return await db.getCollections().postsCollection.findOne({_id: new ObjectId(id)});
    },

    async updatePostById(id: string, updatedPost: PostViewModel) {
        const result = await db.getCollections().postsCollection.updateOne({_id: new ObjectId(id)}, {
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
        const result = await db.getCollections().postsCollection.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount === 1
    },

}