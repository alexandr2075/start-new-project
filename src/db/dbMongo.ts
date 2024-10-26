import {SETTINGS} from "../settings";
import {MongoClient} from 'mongodb';

export let blogsCollection: any;

export const client = new MongoClient(SETTINGS.MONGO_URL);

export async function runDb(): Promise<boolean> {

    const db = client.db(SETTINGS.DB_NAME);

    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await db.command({ping: 1});
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        return true
    } catch {
        // Ensures that the client will close when you finish/error
        console.log("Error connecting to MongoDB!");
        await client.close();
        return false
    }

}
