import {ObjectId, WithId} from "mongodb";
import {CommentInputModel, CommentViewModel} from "../models/commentModel";

export const mapArrToOut = <T extends { _id: any }>(arr: Array<T>) => {
    return arr.map(item => {
        const {_id: id, ...itemWithoutId} = item
        return {id, ...itemWithoutId};
    });
};

export const mapArrToOutWithoutPostId = (arr: WithId<CommentInputModel>[]): CommentViewModel[] => {
    return arr.map((item): CommentViewModel => {
        const {postId, _id: id, ...itemWithoutId} = item
        return {id: id.toString(), ...itemWithoutId};
    });
};

export const mapToOut = <T extends any>(obj: T & { _id: ObjectId }) => {
    const {_id: id, postId, ...itemWithoutId} = obj as any
    return {id, ...itemWithoutId};
};