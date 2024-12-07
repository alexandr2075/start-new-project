import request from 'supertest';
import {app} from '../../src/app';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {db} from "../../src/db/db";
import {testSeeder} from '../integration/test.seeder';
import {HTTP_STATUS} from "../../src/settings";
import type {DeviceViewModel} from '../../src/models/securityModels';

describe('Security Devices', () => {
    let mongoServer: MongoMemoryServer;
    const testUser = testSeeder.createUserDto();
    let tokens: { [key: string]: string } = {};

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await db.run(mongoServer.getUri());

        // // Создаем и подтверждаем пользователя
        // await testSeeder.insertUserConfirmed({...testUser});
    });

    beforeEach(async () => {
        await db.drop();
        tokens = {};
    });

    afterAll(async () => {
        await db.drop();
        await db.stop();
        await mongoServer.stop();
    });

    describe('GET /security/devices', () => {
        it('should return list of devices after multiple logins', async () => {
            // Создаем и подтверждаем пользователя
            await testSeeder.insertUserConfirmed({...testUser});
            // Логин с разных браузеров
            const browsers = ['Chrome', 'Firefox', 'Safari', 'Opera'];

            for (const browser of browsers) {
                const response = await request(app)
                    .post('/auth/login')
                    .set('User-Agent', browser)
                    .send({
                        loginOrEmail: testUser.email,
                        password: testUser.password
                    })
                    .expect(HTTP_STATUS.OK);

                tokens[browser] = response.headers['set-cookie'][0];
            }

            // Получаем список устройств
            const devicesResponse = await request(app)
                .get('/security/devices')
                .set('Cookie', tokens['Chrome'])
                .expect(HTTP_STATUS.OK);

            const devices: DeviceViewModel[] = devicesResponse.body;
            console.log('devices response', devices);
            // Проверяем, что все устройства присутствуют
            expect(devices).toHaveLength(4);
            expect(devices).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        title: expect.stringMatching(/Chrome|Firefox|Safari|Opera/),
                        ip: expect.any(String),
                        lastActiveDate: expect.any(String),
                        deviceId: expect.any(String)
                    })
                ])
            );

            //Проверяем, что все браузеры представлены
            const browserTitles = devices.map(d => d.title);
            browsers.forEach(browser => {
                expect(browserTitles).toContain(browser);
            });
        });

        it('should return 401 without auth token', async () => {
            await request(app)
                .get('/security/devices')
                .expect(HTTP_STATUS.UNAUTHORIZED);
        });
    });
});