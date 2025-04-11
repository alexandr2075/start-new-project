import {BlogModel} from "../../domains/blog.entity";
import {PostModel} from "../../domains/post.entity";
import {UserModel} from "../../domains/user.entity";
import {SecurityModel} from "../../domains/security.entity";

export const deleteAllData = async () => {
    await BlogModel.deleteMany({})
    await PostModel.deleteMany({})
    await UserModel.deleteMany({})
    await SecurityModel.deleteMany({})
}