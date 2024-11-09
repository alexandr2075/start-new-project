import {client} from "../../db/dbMongo";
import {SETTINGS} from "../../settings";
import {QueryUserModel} from "../../models/usersModels";
import {paginationQueriesUsers} from "../../helpers/pagination-queries-users";
import {UsersViewModel, UserViewModel} from "../../models/usersModels";
import {ObjectId} from "mongodb";

export const usersQueryRepository = {
    async getAllUsers(query: QueryUserModel): Promise<UsersViewModel> {
        const defaultValues = paginationQueriesUsers(query)
        let search = {};

        if (defaultValues.searchLoginTerm) {
            search = {login: {$regex: defaultValues.searchLoginTerm, $options: 'i'}}
        }

        if (defaultValues.searchEmailTerm) {
            search = {email: {$regex: defaultValues.searchEmailTerm, $options: 'i'}}
        }


        const items = await client.db(SETTINGS.DB_NAME)
            .collection<UserViewModel>('users').find(search)
            .sort(defaultValues.sortBy, defaultValues.sortDirection)
            .skip((defaultValues.pageNumber - 1) * defaultValues.pageSize)
            .limit(defaultValues.pageSize)
            .toArray()

        const totalCount = await client.db(SETTINGS.DB_NAME)
            .collection<UserViewModel>('users').countDocuments(search)

        return {
            pagesCount: Math.ceil(totalCount / defaultValues.pageSize),
            page: defaultValues.pageNumber,
            pageSize: defaultValues.pageSize,
            totalCount,
            items: items
        }
    },

    async getUserByObjectId(_id: ObjectId) {
        return await client.db(SETTINGS.DB_NAME).collection<UserViewModel>('users').findOne({_id})
    },

}