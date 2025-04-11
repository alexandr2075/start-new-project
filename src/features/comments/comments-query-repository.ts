import {CommentModel} from "../../domains/comment.entity";

export const commentsQueryRepository = {

    async getCommentById(id: string) {
        return CommentModel.findById(id)
    },
}