import {BlogViewModel} from "../types/viewModel";
import {CommentViewModel} from "./commentModel";
import {PostViewModel} from "./postsModels";

export type ResponseModel = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: BlogViewModel[] | PostViewModel[] | CommentViewModel[],
}