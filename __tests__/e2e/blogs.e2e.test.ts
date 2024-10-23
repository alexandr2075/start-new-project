import request from "supertest";
import {app} from "../../src/app";

describe('blogs', () => {


    it('Should return list all blogs', async () => {
        await request(app)
            .get('/hometask_03/api/blogs')
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