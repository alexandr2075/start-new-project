import {CommentViewModelInDB} from "../../models/commentModel";
import {ObjectId} from "mongodb";
import {mapToOut} from "../../helpers/mapper";
import {db} from "../../db/db";

export const commentsQueryRepository = {

    async getCommentById(id: string): Promise<CommentViewModelInDB | null> {
        return db.getCollections().commentsCollection.findOne({_id: new ObjectId(id)})
            .then(createdComment => {
                if (createdComment) return mapToOut(createdComment)
                return createdComment
            });
    },
}