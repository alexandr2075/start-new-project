import request from "supertest";
import {app} from "../../src/app";
import {HTTP_STATUS, SETTINGS} from "../../src/settings";
import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../../src/db/db";

describe('blogs', () => {

    const buff2 = Buffer.from(SETTINGS.ADMIN_AUTH, 'utf8')
    const codedAuth = buff2.toString('base64')

    let mongoServer: MongoMemoryServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await db.run(uri)
    });

    afterAll(async () => {
        await db.client.close();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        await request(app).delete(SETTINGS.PATH.TESTING_ALL_DATA)
    })

    it('Should return list all blogs', async () => {
        await request(app)
            .get(SETTINGS.PATH.BLOGS)
            .expect(HTTP_STATUS.OK)
    })

    it('Should return blog by id', async () => {
        const res = await request(app)
            .get(SETTINGS.PATH.BLOGS)

        if (res.body[0]) {
            await request(app)
                .get(`${SETTINGS.PATH.BLOGS}/${res.body[0].id}`)
                .expect(HTTP_STATUS.OK)
        }

    })

    it('Should create new blog in list of all blogs', async () => {

        await request(app)
            .post(SETTINGS.PATH.BLOGS)
            .set({authorization: 'Basic ' + codedAuth})
            .send(
                {
                    "name": "string",
                    "description": "string",
                    "websiteUrl": "https://ku8sxkBZ3omjy0iX7.com"
                }
            )
            .expect(HTTP_STATUS.CREATED)
    })

    it(`Shouldn't create new blog in list of all blogs`, async () => {
        await request(app)
            .post(SETTINGS.PATH.BLOGS)
            .set({authorization: 'Basic ' + codedAuth})
            .send(
                {
                    "name": "Sergey",
                }
            )
            .expect(HTTP_STATUS.BAD_REQUEST)
    })

    it('Should delete blog by id', async () => {
        const res = await request(app)
            .get(SETTINGS.PATH.BLOGS)

        if (res.body[0]) {
            await request(app)
                .delete(`${SETTINGS.PATH.BLOGS}/${res.body[0].id}`)
                .set({authorisation: 'Basic ' + codedAuth})
                .expect(HTTP_STATUS.NO_CONTENT)
        }
        expect(res.body[0]).toBe(undefined)
    })

})