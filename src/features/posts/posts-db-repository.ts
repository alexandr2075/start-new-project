import {client} from "../../db/dbMongo";
import {SETTINGS} from "../../settings";
import {CommentInputModel, CommentViewModel} from "../../models/commentModel";
import {PostViewModel} from "../../models/postsModels";

export const postsRepository = {
    async createPost(newPost: PostViewModel) {
        const insertAcknow = await client.db(SETTINGS.DB_NAME).collection<PostViewModel>('posts').insertOne(newPost);
        return await client.db(SETTINGS.DB_NAME).collection<PostViewModel>('posts').findOne({_id: new Object(insertAcknow.insertedId)})
    },

    async getPostById(id: string): Promise<PostViewModel | null> {
        return await client.db(SETTINGS.DB_NAME).collection<PostViewModel>('posts').findOne({id: id});
    },

    async updatePostById(id: string, updatedPost: PostViewModel) {
        const result = await client.db(SETTINGS.DB_NAME).collection<PostViewModel>('posts').updateOne({_id: new Object(id)}, {
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
        const result = await client.db(SETTINGS.DB_NAME).collection<PostViewModel>('posts').deleteOne({_id: new Object(id)});
        return result.deletedCount === 1
    },

    async createCommentByPostId(newComment: CommentInputModel) {
        const insertAcknow = await client.db(SETTINGS.DB_NAME)
            .collection<CommentInputModel>('comments').insertOne(newComment);
        return await client.db(SETTINGS.DB_NAME)
            .collection<CommentViewModel>('comments').findOne({_id: new Object(insertAcknow.insertedId)})

    },
}