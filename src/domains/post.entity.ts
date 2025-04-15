import mongoose, {HydratedDocument, Model, model, Schema} from "mongoose";
import {
    ExtendedLikesInfoViewModel,
    LikeDetailsViewModel,
    LikesInfoViewModel,
    PostViewModel
} from "../models/postsModels";

type PostModel = Model<PostViewModel>

export type PostDocument = HydratedDocument<PostViewModel>

const LikeDetailsViewSchema = new Schema<LikeDetailsViewModel>({
    addedAt: Date,
    userId: String,
    login: String,
})

const ExtendedLikesInfoViewSchema = new Schema<ExtendedLikesInfoViewModel>({
    likesCount: Number,
    dislikesCount: Number,
    myStatus: String,
    newestLikes: [LikeDetailsViewSchema]
})

const LikesInfoSchema = new Schema<LikesInfoViewModel>({
    userIdWhoLiked: [String],
    userIdWhoDisliked: [String],
    likesCount: Number,
    dislikesCount: Number,
    myStatus: String,
    newestLikes: [LikeDetailsViewSchema]
})

const postSchema = new mongoose.Schema<PostViewModel>({
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: String,
    blogName: String,
    createdAt: String,
    extendedLikesInfo: LikesInfoSchema
})

export const PostModel = model<PostViewModel, PostModel>("Post", postSchema)