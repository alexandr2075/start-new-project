import * as mongoose from 'mongoose';
import {HydratedDocument, model, Model} from 'mongoose';
import {BlogInputModel} from "../models/blogsModels";

type BlogModel = Model<BlogInputModel>;

export type BlogDocument = HydratedDocument<BlogInputModel>;

const blogSchema = new mongoose.Schema<BlogInputModel>({
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    createdAt: {type: Date, required: true},
    isMembership: {type: Boolean, required: true},
});

export const BlogModel = model<BlogInputModel, BlogModel>('blog', blogSchema);