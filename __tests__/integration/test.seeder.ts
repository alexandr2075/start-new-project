import {randomUUID} from "crypto";
import {add} from "date-fns/add";
import {db} from "../../src/db/db";
import {UserInputDBModel, UserInputModel} from "../../src/models/usersModels";

export const testSeeder = {
    createUserDto() {
        return {
            login: 'testing12',
            email: 'test@gmail.com',
            password: '123456789'
        }
    },

    createUserDtos(count: number) {
        const users = [];

        for (let i = 0; i <= count; i++) {
            users.push({
                login: 'test' + i,
                email: `test${i}@gmail.com`,
                password: '12345678'
            })
        }
        return users;
    },

    async insertUser({login, password, email, code}: UserInputModel) {
        const newUser: UserInputDBModel = {
            login,
            email,
            password: password,
            createdAt: new Date(),
            emailConfirmation: {
                confirmationCode: code ?? randomUUID(),
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
    }
}