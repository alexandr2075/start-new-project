import {QueryUserModel, UserInputDBModel, UsersViewModel, UserViewModel} from "../../models/usersModels";
import {paginationQueriesUsers} from "../../helpers/pagination-queries-users";
import {ObjectId, WithId} from "mongodb";
import {UserModel} from "../../domains/user.entity";

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

        const items = await UserModel.find(search)
            .sort({[defaultValues.sortBy]: defaultValues.sortDirection})
            .skip((defaultValues.pageNumber - 1) * defaultValues.pageSize)
            .limit(defaultValues.pageSize)

        const itemsWithId = items.map((user) => {
            return {
                id: user._id.toString(),
                login: user.login,
                email: user.email,
                createdAt: user.createdAt
            }
        })
        const totalCount = await UserModel.countDocuments(search)

        return {
            pagesCount: Math.ceil(totalCount / defaultValues.pageSize),
            page: defaultValues.pageNumber,
            pageSize: defaultValues.pageSize,
            totalCount,
            items: itemsWithId
        }
    },

    async getUserByObjectId(_id: ObjectId) {
        const user = await UserModel
            .findOne({_id}, {projection: {password: 0}})
        return user ? this._getInView(user) : null;
    },

    async findById(id: string): Promise<UserViewModel | null> {
        if (!this._checkObjectId(id)) return null;
        const user = await UserModel.findOne({_id: new ObjectId(id)});
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