import {ObjectId} from "mongodb";

export const mapArrToOut = <T extends { _id: any }>(arr: Array<T>) => {
    return arr.map(item => {
        const {_id: id, ...itemWithoutId} = item
        return {id, ...itemWithoutId};
    });
};

export const mapArrToOutWithoutPostId = <T extends { _id: ObjectId; postId?: string }>(arr: Array<T>) => {
    return arr.map(item => {
        const {postId, _id: id, ...itemWithoutId} = item
        return {id, ...itemWithoutId};
    });
};

export const mapToOut = <T extends any>(obj: T & { _id: ObjectId }) => {
    const {_id: id, postId, ...itemWithoutId} = obj as any
    return {id, ...itemWithoutId};
};