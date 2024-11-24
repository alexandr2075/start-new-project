import {MongoMemoryServer} from 'mongodb-memory-server';
import {MongoClient, Db} from 'mongodb';
import {randomUUID} from "crypto";
import {add} from "date-fns/add";
import {usersRepository} from "../../src/features/users/users-db-repository";
import {UserInputDBModel} from "../../src/models/usersModels";
import {db} from "../../src/db/db";

let mongoServer: MongoMemoryServer;
let client: MongoClient;


beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    console.log('uri', uri)
    await db.run(uri)
});

afterAll(async () => {
    await client.close();
    await mongoServer.stop();
});

beforeEach(async () => {
    await db.drop(); // Очищаем базу данных перед каждым тестом
});

describe('MongoMemoryServer Integration Test', () => {
    it('should connect to in-memory database and insert a document', async () => {
        // const usersCollection = db.collection('users');
        const usersCollection = db.getCollectionByName('users');
        // const mockUser = {name: 'Test User', email: 'test@example.com'};
        const mockUser = {
            login: 'Test User',
            email: 'test@example.com',
            password: 'password',
            createdAt: new Date(),
            emailConfirmation: {
                confirmationCode: randomUUID(),
                expirationDate: add(new Date(), {
                    minutes: 30,
                }),
                isConfirmed: 'unconfirmed',
            }
        };

        // const result = await usersCollection.insertOne(mockUser);
        // @ts-ignore
        const result = await usersRepository.createUser(mockUser);

        expect(result).toBeDefined();

        // const user = await usersCollection.findOne({_id: result.insertedId});
        const user = await usersRepository.getUserById(result._id.toString());
        console.log('user', user);
        expect(user).toEqual(expect.objectContaining(mockUser));
    });
});
