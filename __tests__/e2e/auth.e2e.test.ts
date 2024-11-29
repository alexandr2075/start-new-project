import request from 'supertest';
import {app} from '../../src/app';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {db} from "../../src/db/db";
import {testSeeder} from '../integration/test.seeder';
import {HTTP_STATUS} from "../../src/settings";
import {nodemailerService} from "../../src/adapters/nodemailer";
import {usersRepository} from "../../src/features/users/users-db-repository";
import {usersQueryRepository} from "../../src/features/users/users-query-repository";
import {cookie} from "express-validator";

describe('Auth Routes e2e', () => {
    let mongoServer: MongoMemoryServer;
    let accessToken: string;
    let refreshToken: string;
    let refreshTokenCookie: string;
    const testUser = testSeeder.createUserDto();

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await db.run(mongoServer.getUri());
    });

    beforeEach(async () => {
        await db.drop();
    });

    afterAll(async () => {
        await db.drop();
        await db.stop();
        await mongoServer.stop();
    });

    describe('POST /auth/registration', () => {

        nodemailerService.sendEmail = jest
            .fn()
            .mockImplementation(
                () =>
                    Promise.resolve(true)
            );

        it('should register new user successfully', async () => {
            await request(app)
                .post('/auth/registration')
                .send(testUser)
                .expect(HTTP_STATUS.NO_CONTENT);
        });

        it('should return 400 for invalid registration data', async () => {
            const invalidUser = {...testUser, email: 'invalid-email'};

            const response = await request(app)
                .post('/auth/registration')
                .send(invalidUser)
                .expect(HTTP_STATUS.BAD_REQUEST);

            expect(response.body.errorsMessages).toBeDefined();
        });

        it('should not register user with existing email', async () => {
            // First registration
            await request(app)
                .post('/auth/registration')
                .send(testUser);

            // Try to register again with same email
            const response = await request(app)
                .post('/auth/registration')
                .send(testUser)
                .expect(HTTP_STATUS.BAD_REQUEST);

            expect(response.body.errorsMessages).toBeDefined();
        });
    });

    describe('POST /auth/login', () => {
        beforeEach(async () => {
            // Register and confirm user before login tests
            await testSeeder.insertUser({
                ...testUser,
                isConfirmed: "confirmed"
            });
        });


        it('should login successfully with correct credentials', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({
                    loginOrEmail: testUser.email,
                    password: testUser.password
                })
                .expect(HTTP_STATUS.OK);

            expect(response.body.accessToken).toBeDefined();
            expect(response.headers['set-cookie']).toBeDefined();

            // Save tokens for other tests
            accessToken = response.body.accessToken;
            refreshToken = response.headers['set-cookie'][0];
        });

        it('should return 401 for incorrect password', async () => {
            await request(app)
                .post('/auth/login')
                .send({
                    loginOrEmail: testUser.email,
                    password: 'wrong-password'
                })
                .expect(HTTP_STATUS.UNAUTHORIZED);
        });
    });

    describe('GET /auth/me', () => {
        beforeEach(async () => {
            // Register and confirm user before login tests
            await testSeeder.insertUser({
                ...testUser,
                isConfirmed: "confirmed"
            });
            // Login before each test
            const response = await request(app)
                .post('/auth/login')
                .send({
                    loginOrEmail: testUser.email,
                    password: testUser.password
                });

            accessToken = response.body.accessToken;
        });

        it('should return user info with valid token', async () => {
            const response = await request(app)
                .get('/auth/me')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(HTTP_STATUS.OK);

            expect(response.body).toEqual({
                email: testUser.email,
                login: testUser.login,
                userId: expect.any(String)
            });
        });

        it('should return 401 without token', async () => {
            await request(app)
                .get('/auth/me')
                .expect(HTTP_STATUS.UNAUTHORIZED);
        });
    });

    describe('POST /auth/refresh-token', () => {
        // Перед тестами выполняем логин для получения токенов
        beforeEach(async () => {
            // Регистрируем и подтверждаем пользователя
            await testSeeder.insertUser({
                ...testUser,
                isConfirmed: "confirmed"
            });

            // Выполняем логин
            const loginResponse = await request(app)
                .post('/auth/login')
                .send({
                    loginOrEmail: testUser.email,
                    password: testUser.password
                });

            accessToken = loginResponse.body.accessToken;
            refreshTokenCookie = loginResponse.headers['set-cookie'][0];
        });

        it('should refresh tokens successfully', async () => {
            // Небольшая задержка, чтобы убедиться, что токены различаются
            await new Promise(resolve => setTimeout(resolve, 1000));

            const response = await request(app)
                .post('/auth/refresh-token')
                .set('Cookie', refreshTokenCookie)
                .expect(HTTP_STATUS.OK);

            // Проверяем, что получили новые токены
            expect(response.body.accessToken).toBeDefined();
            expect(response.body.accessToken).not.toBe(accessToken);
            expect(response.headers['set-cookie']).toBeDefined();
            expect(response.headers['set-cookie'][0]).not.toBe(refreshTokenCookie);
        });

        it('should return 401 with invalid refresh token', async () => {
            await request(app)
                .post('/auth/refresh-token')
                .set('Cookie', 'refreshToken=invalid-token')
                .expect(HTTP_STATUS.UNAUTHORIZED);
        });

        it('should return 401 without refresh token', async () => {
            await request(app)
                .post('/auth/refresh-token')
                .expect(HTTP_STATUS.UNAUTHORIZED);
        });

    });

    describe('POST /auth/logout', () => {

        beforeEach(async () => {
            // Регистрируем и подтверждаем пользователя
            await testSeeder.insertUser({
                ...testUser,
                isConfirmed: "confirmed"
            });

            // Выполняем логин
            const loginResponse = await request(app)
                .post('/auth/login')
                .send({
                    loginOrEmail: testUser.email,
                    password: testUser.password
                });

            accessToken = loginResponse.body.accessToken;
            refreshTokenCookie = loginResponse.headers['set-cookie'][0];
        });

        it('should logout successfully', async () => {

            await request(app)
                .post('/auth/logout')
                .set('Cookie', refreshTokenCookie)
                .expect(HTTP_STATUS.NO_CONTENT);

            // Verify refresh token is invalidated
            await request(app)
                .post('/auth/refresh-token')
                .set('Cookie', refreshTokenCookie)
                .expect(HTTP_STATUS.UNAUTHORIZED);
        });
    });

    describe('POST /auth/registration-confirmation', () => {
        let confirmationCode: string;

        beforeEach(async () => {
            // Register user and get confirmation code
            const user = await testSeeder.insertUser(testUser);
            confirmationCode = user.emailConfirmation.confirmationCode;
        });

        it('should confirm registration with valid code', async () => {
            await request(app)
                .post('/auth/registration-confirmation')
                .send({code: confirmationCode})
                .expect(HTTP_STATUS.NO_CONTENT);
        });

        it('should return 400 for invalid confirmation code', async () => {
            await request(app)
                .post('/auth/registration-confirmation')
                .send({code: 'invalid-code'})
                .expect(HTTP_STATUS.BAD_REQUEST);
        });
    });

    describe('POST /auth/registration-email-resending', () => {

        nodemailerService.sendEmail = jest
            .fn()
            .mockImplementation(
                () =>
                    Promise.resolve(true)
            );

        beforeEach(async () => {
            await testSeeder.insertUser(testUser);
        });

        it('should resend confirmation email successfully', async () => {
            await request(app)
                .post('/auth/registration-email-resending')
                .send({email: testUser.email})
                .expect(HTTP_STATUS.NO_CONTENT);
        });

        it('should return 400 for non-existent email', async () => {
            await request(app)
                .post('/auth/registration-email-resending')
                .send({email: 'nonexistent@email.com'})
                .expect(HTTP_STATUS.BAD_REQUEST);
        });
    });
});