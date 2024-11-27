import {MongoMemoryServer} from 'mongodb-memory-server';
import {testSeeder} from './test.seeder';
import {db} from "../../src/db/db";
import {nodemailerService} from "../../src/adapters/nodemailer";
import {authService} from "../../src/features/auth-login/auth-service";
import {HTTP_STATUS} from "../../src/settings";
import {randomUUID} from "crypto";
import {UUID} from "node:crypto";

describe('AUTH-INTEGRATION', () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        console.log('uri', uri)
        await db.run(uri);
    });

    beforeEach(async () => {
        await db.drop();
    });

    afterAll(async () => {
        await db.drop();
        await db.stop();
    });

    afterAll(done => done());

    describe('User Registration', () => {
        nodemailerService.sendEmail = jest
            .fn()
            .mockImplementation(
                () =>
                    Promise.resolve(true)
            );

        const registerUserUseCase = authService.authRegistrationUser

        it('should register user with correct data', async () => {
            const user = testSeeder.createUserDto();
            const result = await registerUserUseCase(user);

            expect(result.status).toBe(HTTP_STATUS.NO_CONTENT);
            expect(nodemailerService.sendEmail).toHaveBeenCalled();
            expect(nodemailerService.sendEmail).toHaveBeenCalledTimes(1);
        });

        it('should not register user twice', async () => {
            const user = testSeeder.createUserDto();
            await testSeeder.insertUser(user);

            const result = await registerUserUseCase(user);

            expect(result.status).toBe(HTTP_STATUS.BAD_REQUEST);
        });
    });


    const confirmEmailUseCase = authService.authRegistrationEmailResendUser;

    it('should not confirm email if user does not exist', async () => {
        const result = await confirmEmailUseCase('bnfgndflkgmk');

        expect(result.status).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    it('should not confirm email which is confirmed', async () => {
        const code: UUID = randomUUID();

        const {login, password, email} = testSeeder.createUserDto();
        await testSeeder.insertUser({
            login,
            password,
            email,
            code,
            isConfirmed: "confirmed",
        });

        const result = await confirmEmailUseCase(code);

        expect(result.status).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    it('should not confirm email with expired code', async () => {
        const code: UUID = randomUUID();

        const {login, password, email} = testSeeder.createUserDto();
        await testSeeder.insertUser({
            login,
            password,
            email,
            code,
            expirationDate: new Date(),
        });

        const result = await confirmEmailUseCase(code);

        expect(result.status).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    it('confirm user', async () => {
        const code = '123e4567-e89b-12d3-a456-426614174000';

        const {login, password, email} = testSeeder.createUserDto();
        await testSeeder.insertUser({login, password, email, code});

        const result = await authService.authRegConfUser(code);

        expect(result.status).toBe(HTTP_STATUS.NO_CONTENT);
    });

});




