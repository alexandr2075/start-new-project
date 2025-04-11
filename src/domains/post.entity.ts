import mongoose, {HydratedDocument, Model, model} from "mongoose";
import {PostViewModel} from "../models/postsModels";

type PostModel = Model<PostViewModel>

export type PostDocument = HydratedDocument<PostViewModel>

const postSchema = new mongoose.Schema<PostViewModel>({
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: String,
    blogName: String,
    createdAt: Date,
})

export const PostModel = model<PostViewModel, PostModel>("Post", postSchema)