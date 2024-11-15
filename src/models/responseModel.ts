import {CommentViewModel} from "./commentModel";
import {PostViewModel} from "./postsModels";
import {BlogViewModel} from "./blogsModels";

export type ResponseModel = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: BlogViewModel[] | PostViewModel[] | CommentViewModel[],
}