import {PostViewModel} from "../../models/postsModels";
import {ObjectId} from "mongodb";
import {PostModel} from "../../domains/post.entity";
import {CommentModel} from "../../domains/comment.entity";

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

    async updateLike(postId: string, likeStatus: string, userId: string, login: string) {
        const singleLike = {
            addedAt: new Date(),
            userId,
            login
        };

        const result = await PostModel.updateOne(
            {_id: new ObjectId(postId)},
            {
                $pull: {'extendedLikesInfo.userIdWhoDisliked': userId},
                $push: {
                    'extendedLikesInfo.userIdWhoLiked': userId,
                    'extendedLikesInfo.newestLikes': singleLike
                }
            }
        );

        return result.modifiedCount > 0;
    },

    async updateDislike(postId: string, likeStatus: string, userId: string, login: string) {

        const result = await PostModel.updateOne(
            {_id: new ObjectId(postId)},
            {
                $pull: {
                    'extendedLikesInfo.userIdWhoLiked': userId,
                    'extendedLikesInfo.newestLikes': {userId}
                },
                $push: {
                    'extendedLikesInfo.userIdWhoDisliked': userId
                }
            }
        );

        return result.modifiedCount > 0;

    },

    async updateNone(postId: string, likeStatus: string, userId: string, login: string) {

        const result = await PostModel.updateOne({_id: new ObjectId(postId)}, {
            $pull: {
                'extendedLikesInfo.userIdWhoDisliked': userId,
                'extendedLikesInfo.userIdWhoLiked': userId,
            }
        });
        return result.matchedCount === 1
    },

    async deletePostById(id: string) {
        const result = await PostModel.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount === 1
    },

}