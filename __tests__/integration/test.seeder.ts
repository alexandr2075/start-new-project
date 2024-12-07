import {randomUUID} from "crypto";
import {add} from "date-fns/add";
import {db} from "../../src/db/db";
import {UserInputDBModel, UserInputModel} from "../../src/models/usersModels";
import {genHashPassword} from "../../src/helpers/genHashPassword";

export const testSeeder = {
    createUserDto() {
        return {
            login: 'testing12',
            email: 'test@gmail.com',
            password: '123456789'
        }
    },

    createUserDtos(count: number): UserInputModel[] {
        const users: UserInputModel[] = [];

        for (let i = 0; i <= count; i++) {
            users.push({
                login: 'test' + i,
                email: `test${i}@gmail.com`,
                password: '12345678'
            })
        }
        return users;
    },

    async insertUserUnconfirmed({login, password, email}: UserInputModel) {
        const hashPassword = await genHashPassword(password)
        const newUser: UserInputDBModel = {
            login,
            email,
            password: hashPassword,
            createdAt: new Date(),
            emailConfirmation: {
                confirmationCode: randomUUID(),
                expirationDate: add(new Date(), {
                    minutes: 30,
                }),
                isConfirmed: 'unconfirmed'
            }
        };
        const res = await db.getCollections().usersCollection.insertOne({...newUser})
        return {
            _id: res.insertedId.toString(),
            ...newUser
        }
    },

    async insertUserConfirmed({login, password, email}: UserInputModel) {
        const hashPassword = await genHashPassword(password)
        const newUser: UserInputDBModel = {
            login,
            email,
            password: hashPassword,
            createdAt: new Date(),
            emailConfirmation: {
                confirmationCode: randomUUID(),
                expirationDate: add(new Date(), {
                    minutes: 30,
                }),
                isConfirmed: 'confirmed'
            }
        };
        const res = await db.getCollections().usersCollection.insertOne({...newUser})
        return {
            _id: res.insertedId.toString(),
            ...newUser
        }
    }
}