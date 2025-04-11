import {SETTINGS} from "../settings";
import mongoose from "mongoose";

export const db = {
    // client: {} as MongoClient,

    // getDbName() {
    //     return this.client.db(SETTINGS.DB_NAME);
    // },
    async run(url: string) {
        try {
            // this.client = new MongoClient(url)
            // await this.client.connect();

            await mongoose.connect(url + "/" + SETTINGS.DB_NAME);
            // await this.client.db(SETTINGS.DB_NAME).command({ping: 1});
            console.log("Connected successfully to mongo server");
        } catch (e: unknown) {
            console.error("Can't connect to mongo server", e);
            // await this.client.close();
            await mongoose.disconnect()
        }

    },
    async stop() {
        // await this.client.close();
        await mongoose.disconnect();
        console.log("Connection successful closed");
    },
    async drop() {
        try {
            //await this.getDbName().dropDatabase()
            // const collections = await this.client.db(SETTINGS.DB_NAME).listCollections().toArray();

            // for (const collection of collections) {
            //     const collectionName = collection.name;
            //     await this.client.db(SETTINGS.DB_NAME).collection(collectionName).deleteMany({});
            // }
        } catch (e: unknown) {
            console.error('Error in drop db:', e);
            await this.stop();
        }
    },
    // getCollections() {
    //     return {
    //         usersCollection: this.getDbName().collection<UserInputDBModel>('users'),
    //         blogsCollection: this.getDbName().collection<BlogViewModel>('blogs'),
    //         postsCollection: this.getDbName().collection<PostViewModel>('posts'),
    //         commentsCollection: this.getDbName().collection<CommentInputModel>('comments'),
    //         security_devicesCollection: this.getDbName().collection<DeviceDBType>('security_devices'),
    //         requestsCollection: this.getDbName().collection<RequestAttemptDBType>('requests'),
    //     }
    // },
    // getCollectionByName(name: string) {
    //     return this.getDbName().collection<UserInputDBModel>(name)
    // },
    // getClient() {
    //     return this.client;
    // }
}


// export const usersCollection = db.client.db(SETTINGS.DB_NAME).collection<Omit<UserDBModel, '_id'>>('users')