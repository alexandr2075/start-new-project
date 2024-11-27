import {db} from "../../db/db";

export const deleteAllData = async () => {
    await db.getCollections().blogsCollection.deleteMany({})
    await db.getCollections().postsCollection.deleteMany({})
    await db.getCollections().usersCollection.deleteMany({})
    await db.getCollections().commentsCollection.deleteMany({})
}