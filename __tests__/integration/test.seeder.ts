import {randomUUID} from "crypto";
import {add} from "date-fns/add";
import {db} from "../../src/db/db";

type RegisterUserPayloadType = {
    login: string,
    password: string,
    email: string,
    code?: string,
    expirationDate?: Date,
    isConfirmed?: boolean
}

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
    async insertUser(
        {
            login,
            password,
            email,
            code,
            expirationDate,
            isConfirmed
        }: RegisterUserPayloadType
    ) {
        const newUser = {
            login,
            email,
            password: password,
            createdAt: new Date(),
            emailConfirmation: {
                confirmationCode: code ?? randomUUID(),
                expirationDate: expirationDate ?? add(new Date(), {
                    minutes: 30,
                }),
                isConfirmed: isConfirmed ?? false
            }
        };
        const res = await db.getCollections().usersCollection.insertOne({...newUser})
        return {
            _id: res.insertedId.toString(),
            ...newUser
        }
    }
}