export const mapToOut = <T extends { _id: any }>(arr: Array<T>) => {
    return arr.map(item => {
        const {_id: id, ...itemWithoutId} = item
        return {id, ...itemWithoutId};
    });
};