// import { MongoMemoryServer } from 'mongodb-memory-server';
// import { MongoClient, Db } from 'mongodb';
//
// let mongoServer: MongoMemoryServer;
// let client: MongoClient;
// let db: Db;
//
// /**
//  * Подключение к памяти MongoDB.
//  */
// export const connectDB = async (uri:string): Promise<Db> => {
//
//     client = new MongoClient(uri);
//     await client.connect();
//
//     db = client.db();
//     return db;
// };
//
// /**
//  * Очистка всех коллекций в базе данных между тестами.
//  */
// export const clearDB = async (): Promise<void> => {
//     if (!db) return;
//     const collections = await db.collections();
//     for (const collection of collections) {
//         await collection.deleteMany({});
//     }
// };
//
// /**
//  * Отключение базы данных после завершения всех тестов.
//  */
// export const closeDB = async (): Promise<void> => {
//     if (client) {
//         await client.close();
//     }
//     if (mongoServer) {
//         await mongoServer.stop();
//     }
// };
