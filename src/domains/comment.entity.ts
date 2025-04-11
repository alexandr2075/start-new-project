import mongoose, {HydratedDocument, Model, model, Schema} from "mongoose";
import {CommentatorInfo, CommentInputModel, LikesInfo} from "../models/commentModel";


type CommentModel = Model<CommentInputModel>;
export type CommentDocument = HydratedDocument<CommentInputModel>;

const CommentatorInfoSchema = new Schema<CommentatorInfo>({
    userId: String,
    userLogin: String
})

const LikesInfoSchema = new Schema<LikesInfo>({
    userIdWhoLiked: [String],
    userIdWhoDisliked: [String],
    likesCount: Number,
    dislikesCount: Number,
    myStatus: String,
})

const CommentSchema = new mongoose.Schema<CommentInputModel>({
    content: String,
    commentatorInfo: CommentatorInfoSchema,
    createdAt: String,
    postId: String,
    likesInfo: LikesInfoSchema
})

export const CommentModel = model<CommentInputModel, CommentModel>("Comment", CommentSchema)