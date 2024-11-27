import request from "supertest";
import {app} from "../../src/app";
import {SETTINGS} from "../../src/settings";
import {blogsRepository} from "../../src/features/blogs/blogs-db-repository";
import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../../src/db/db";

describe('Course', () => {

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

    it('Should return list all posts', async () => {
        await request(app)
            .get(SETTINGS.PATH.POSTS)
            .expect(200)
    })

    it('Should return post by id', async () => {
        const res = await request(app)
            .get(SETTINGS.PATH.POSTS)

        if (res.body[0]) {
            await request(app)
                .get(`${SETTINGS.PATH.POSTS}/${res.body[0].id}`)
                .expect(200)
        }

    })

    it('Should create new post in list of all posts', async () => {
        const newBlog = {
            name: "alex",
            description: "programmer",
            websiteUrl: "https://www.alex.com",
            createdAt: new Date(),
            isMembership: false
        }

        const createdBlog = await blogsRepository.createBlog(newBlog)
        await request(app)
            .post(SETTINGS.PATH.POSTS)
            .set({authorization: 'Basic ' + codedAuth})
            .send(
                {
                    "title": "string",
                    "shortDescription": "string",
                    "content": "https://ku8sxkBZ3omjy0iX7.com",
                    "blogId": createdBlog?._id.toString(),
                }
            )
            .expect(201)
    })

    it(`Shouldn't create new post in list of all posts`, async () => {
        await request(app)
            .post(SETTINGS.PATH.POSTS)
            .set({authorization: 'Basic ' + codedAuth})
            .send(
                {
                    "title": "Sergey",
                }
            )
            .expect(400)
    })

    it('Should delete post by id', async () => {
        const res = await request(app)
            .get(SETTINGS.PATH.POSTS)

        if (res.body[0]) {
            await request(app)
                .delete(`${SETTINGS.PATH.POSTS}/${res.body[0].id}`)
                .set({authorisation: 'Basic ' + codedAuth})
                .expect(204)
        }
    })
})