import request from 'supertest';
import {app} from '../../src/app';
import {HTTP_STATUS} from '../../src/settings';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {db} from '../../src/db/db';
import {businessService} from "../../src/domains/businessService";

describe('Rate Limiting', () => {
    let mongoServer: MongoMemoryServer;
    const testUser = {
        login: 'testuser',
        email: 'test@test.com',
        password: 'password123'
    };

    businessService.sendConfirmationCodeToEmail = jest
        .fn()
        .mockImplementation(
            () =>
                Promise.resolve(true)
        );


    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await db.run(mongoServer.getUri());
    });

    afterAll(async () => {
        await db.drop();
        await db.stop();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        await db.drop();
    });

    describe('Auth endpoints rate limiting', () => {
        it('should limit /auth/login attempts', async () => {
            // Делаем 5 разрешенных попыток
            for (let i = 0; i < 5; i++) {
                await request(app)
                    .post('/auth/login')
                    .send({
                        loginOrEmail: testUser.email,
                        password: 'wrong-password'
                    })
                    .expect(HTTP_STATUS.UNAUTHORIZED);
            }

            // 6-я попытка должна быть заблокирована
            await request(app)
                .post('/auth/login')
                .send({
                    loginOrEmail: testUser.email,
                    password: 'wrong-password'
                })
                .expect(HTTP_STATUS.TOO_MANY_REQUESTS);
        });

        it('should limit /auth/registration attempts', async () => {
            // Делаем 5 разрешенных попыток
            for (let i = 0; i < 5; i++) {
                await request(app)
                    .post('/auth/registration')
                    .send({
                        login: `user${i}`,
                        email: `test${i}@test.com`,
                        password: 'password123'
                    });
            }

            // 6-я попытка должна быть заблокирована
            await request(app)
                .post('/auth/registration')
                .send({
                    login: 'newuser',
                    email: 'new@test.com',
                    password: 'password123'
                })
                .expect(HTTP_STATUS.TOO_MANY_REQUESTS);
        }, 15000); // увеличиваем таймаут до 15 секунд

        it('should reset limits after waiting period', async () => {
            // Делаем 5 попыток
            for (let i = 0; i < 5; i++) {
                await request(app)
                    .post('/auth/login')
                    .send({
                        loginOrEmail: testUser.email,
                        password: 'wrong-password'
                    });
            }

            // Ждем 10 секунд
            await new Promise(resolve => setTimeout(resolve, 10000));

            // Следующая попытка должна быть успешной
            await request(app)
                .post('/auth/login')
                .send({
                    loginOrEmail: testUser.email,
                    password: 'wrong-password'
                })
                .expect(HTTP_STATUS.UNAUTHORIZED); // Не 429
        }, 15000);
    });
});