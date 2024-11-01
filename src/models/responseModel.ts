import {BlogViewModel, PostViewModel} from "../types/viewModel";

export type ResponseModel = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: BlogViewModel[] | PostViewModel[]
}