import request from "supertest";
import {app} from "../../src/app";
import {HTTP_STATUS, SETTINGS} from "../../src/settings";

describe('users', () => {

    const buff2 = Buffer.from(SETTINGS.ADMIN_AUTH, 'utf8')
    const codedAuth = buff2.toString('base64')

    beforeEach(async () => {
        await request(app).delete(SETTINGS.PATH.TESTING_ALL_DATA)
    })

    it('Should return list all users', async () => {
        await request(app)
            .get(SETTINGS.PATH.USERS)
            .expect(HTTP_STATUS.OK)
    })


    it('Should create new user in list of all users', async () => {
        const dataOfCreation = new Date().toISOString()
        await request(app)
            .post(SETTINGS.PATH.USERS)
            .set({authorization: 'Basic ' + codedAuth})
            .send(
                {
                    login: 'lotos',
                    email: 'lotos@lotos.com',
                    password: '123456',
                    createdAt: dataOfCreation
                }
            )
            .expect(HTTP_STATUS.CREATED)

    })

    it(`Shouldn't create new user in list of all users`, async () => {
        await request(app)
            .post(SETTINGS.PATH.USERS)
            .set({authorization: 'Basic ' + codedAuth})
            .send(
                {
                    "login": "Sergey",
                }
            )
            .expect(HTTP_STATUS.BAD_REQUEST)
    })

    it('Should delete user by id', async () => {
        const res = await request(app)
            .get(SETTINGS.PATH.USERS)

        if (res.body[0]) {

            await request(app)
                .delete(`${SETTINGS.PATH.BLOGS}/${res.body[0].id}`)
                .set({authorisation: 'Basic ' + codedAuth})
                .expect(HTTP_STATUS.NO_CONTENT)
        }

    })

})