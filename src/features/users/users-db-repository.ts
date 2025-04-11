import {UserDBModel, UserInputDBModel} from "../../models/usersModels";
import {ObjectId, WithId} from "mongodb";
import {checkObjectId} from "../../helpers/checkValidIdfromObjectId";
import {matchPasswords} from "../../helpers/genHashPassword";
import {UUID} from "node:crypto";
import {UserModel} from "../../domains/user.entity";
import {v4 as uuidv4} from "uuid";


export const usersRepository = {

    async createUser(newUser: UserInputDBModel): Promise<UserDBModel> {
        const user = await UserModel.create(newUser);
        return user
    },

    async isExistsUserByLogin(login: string): Promise<boolean> {
        const user = await UserModel.findOne({login: login})
        if (user && user._id !== undefined) {
            return !!user._id.toString()
        }
        return false
    },

    async isExistsUserByEmail(email: string): Promise<boolean> {
        const user = await UserModel.findOne({email: email})
        if (user && user._id !== undefined) {
            return !!user._id.toString()
        }
        return false
    },

    async getUserByEmail(email: string): Promise<UserDBModel | null> {
        return UserModel.findOne({email: email})
    },

    async getUserById(id: string): Promise<WithId<UserDBModel> | null> {
        return UserModel.findOne({_id: new ObjectId(id)});
    },

    async deleteUserById(id: string): Promise<boolean> {
        const result = await UserModel
            .deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },

    async doesExistById(id: string): Promise<boolean> {
        if (!checkObjectId(id)) return false;
        const isUser = await UserModel.findOne({_id: new ObjectId(id)});
        return !!isUser
    },

    async authLoginUser(loginOrEmail: string, password: string) {
        const user = await UserModel.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]})
        if (!user) return null

        const isPassCorrect = await matchPasswords(password, user.password)
        if (!isPassCorrect) return null
        return user
    },

    async authRegistrationUser(loginOrEmail: string, password: string) {
        const user = await UserModel.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]})
        if (!user) return null

        const isPassCorrect = await matchPasswords(password, user.password)
        if (!isPassCorrect) return null
        return user
    },

    async getUserByConfCode(code: string) {
        const user = await UserModel
            .findOne({'emailConfirmation.confirmationCode': code})
        if (!user) return null
        return user
    },

    async updateUser(id: ObjectId, fieldName: string, fieldValue: string | Date | UUID | null) {
        const user = await UserModel
            .findOneAndUpdate({_id: new ObjectId(id)},
                {$set: {[fieldName]: fieldValue}},
                {returnDocument: 'after'});
        if (!user) return null
        return user
    },

    async updateConfirmationCode(_id: ObjectId) {
        const updatedUser = await UserModel.findOneAndUpdate(
            {_id}, // находим пользователя по id
            {
                $set: {
                    "emailConfirmation.confirmationCode": uuidv4(), // обновляем confirmationCode
                    "emailConfirmation.expirationDate": new Date(Date.now() + 24 * 60 * 60 * 1000), // срок истечения +24 часа
                },
            },
            {returnDocument: "after", runValidators: true} // возвращаем обновлённый документ, проверяем валидацию
        );

        if (!updatedUser) {
            throw new Error("User not found"); // на случай, если пользователь не существует
        }

        return updatedUser; // возвращаем обновлённого пользователя
    },

}