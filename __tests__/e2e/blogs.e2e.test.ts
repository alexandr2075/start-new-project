import request from "supertest";
import {app} from "../../src/app";
import {SETTINGS} from "../../src/settings";

describe('blogs', () => {
    beforeAll(async () => {
        await request(app).get(SETTINGS.PATH.TESTING_ALL_DATA)
            .expect(204, {message: "All data is deleted"})
    })

    it('Should return list all blogs', async () => {
        await request(app)
            .get(SETTINGS.PATH.BLOGS)
            .expect(404, {message: "No videos found"})
    })

    it('Should create new video in list of all videos', async () => {
        await request(app)
            .post('/hometask_01/api/videos')
            .send(
                {
                    "title": "Club",
                    "author": "Sergey",
                }
            )
            .expect(201)
    })

    it(`Shouldn't create new video in list of all videos`, async () => {
        await request(app)
            .post('/hometask_01/api/videos')
            .send(
                {
                    "author": "Sergey",
                }
            )
            .expect(400)
    })

    it('Should delete all videos', async () => {
        await request(app)
            .delete('/hometask_01/api/testing/all-data')
            .expect(204)

    })

})