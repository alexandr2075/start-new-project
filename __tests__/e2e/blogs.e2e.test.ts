import request from "supertest";
import {app} from "../../src/app";
import {SETTINGS} from "../../src/settings";

describe('blogs', () => {

    const buff2 = Buffer.from(SETTINGS.ADMIN_AUTH, 'utf8')
    const codedAuth = buff2.toString('base64')

    beforeEach(async () => {
        await request(app).delete(SETTINGS.PATH.TESTING_ALL_DATA)
    })

    it('Should return list all blogs', async () => {
        await request(app)
            .get(SETTINGS.PATH.BLOGS)
            .expect(200)
    })

    it('Should return blog by id', async () => {
        const res = await request(app)
            .get(SETTINGS.PATH.BLOGS)

        if (res.body[0]) {
            await request(app)
                .get(`${SETTINGS.PATH.BLOGS}/${res.body[0].id}`)
                .expect(200)
        }

    })

    it('Should create new blog in list of all blogs', async () => {

        await request(app)
            .post(SETTINGS.PATH.BLOGS)
            .set({authorisation: 'Basic ' + codedAuth})
            .send(
                {
                    "name": "string",
                    "description": "string",
                    "websiteUrl": "https://ku8sxkBZ3omjy0iX7.com"
                }
            )
            .expect(201)
    })

    it(`Shouldn't create new blog in list of all blogs`, async () => {
        await request(app)
            .post(SETTINGS.PATH.BLOGS)
            .set({authorisation: 'Basic ' + codedAuth})
            .send(
                {
                    "name": "Sergey",
                }
            )
            .expect(400)
    })

    it('Should delete blog by id', async () => {
        const res = await request(app)
            .get(SETTINGS.PATH.BLOGS)

        if (res.body[0]) {

            await request(app)
                .delete(`${SETTINGS.PATH.BLOGS}/${res.body[0].id}`)
                .set({authorisation: 'Basic ' + codedAuth})
                .expect(204)
        }

    })

})