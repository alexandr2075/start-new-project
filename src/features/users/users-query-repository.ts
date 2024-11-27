import {QueryUserModel, UserInputDBModel, UsersViewModel, UserViewModel} from "../../models/usersModels";
import {paginationQueriesUsers} from "../../helpers/pagination-queries-users";
import {ObjectId, WithId} from "mongodb";
import {db} from "../../db/db";

export const usersQueryRepository = {
    async getAllUsers(query: QueryUserModel): Promise<UsersViewModel> {
        const defaultValues = paginationQueriesUsers(query)
        let search = {};

        if (defaultValues.searchLoginTerm || defaultValues.searchEmailTerm) {
            search = {
                $or: [{login: {$regex: defaultValues.searchLoginTerm, $options: 'i'}},
                    {email: {$regex: defaultValues.searchEmailTerm, $options: 'i'}}]
            }
        }

        const items = await db.getCollections().usersCollection.find(search)
            .sort(defaultValues.sortBy, defaultValues.sortDirection)
            .skip((defaultValues.pageNumber - 1) * defaultValues.pageSize)
            .limit(defaultValues.pageSize)
            .toArray()

        const itemsWithId = items.map((user) => {
            return {
                id: user._id.toString(),
                login: user.login,
                email: user.email,
                createdAt: user.createdAt
            }
        })
        const totalCount = await db.getCollections().usersCollection.countDocuments(search)

        return {
            pagesCount: Math.ceil(totalCount / defaultValues.pageSize),
            page: defaultValues.pageNumber,
            pageSize: defaultValues.pageSize,
            totalCount,
            items: itemsWithId
        }
    },

    async getUserByObjectId(_id: ObjectId) {
        const user = await db.getCollections().usersCollection
            .findOne({_id}, {projection: {password: 0}})
        return user ? this._getInView(user) : null;
    },

    async findById(id: string): Promise<UserViewModel | null> {
        if (!this._checkObjectId(id)) return null;
        const user = await db.getCollections().usersCollection.findOne({_id: new ObjectId(id)});
        return user ? this._getInView(user) : null;
    },
    _getInView(user: WithId<UserInputDBModel>): UserViewModel {
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt,
        };
    },
    _checkObjectId(id: string): boolean {
        return ObjectId.isValid(id)
    }

}