import {db} from "../../db/db";
import {WithId} from "mongodb";
import type {DeviceDBType} from "../../models/securityModels";

export const securityRepository = {
    async createDevice(device: DeviceDBType): Promise<boolean> {
        const result = await db.getCollections().security_devicesCollection
            .insertOne(device);
        return result.acknowledged;
    },

    async findDevices(userId: string): Promise<DeviceDBType[]> {
        return db.getCollections().security_devicesCollection
            .find({userId})
            .toArray();
    },

    async findDevicesByUserIdIat(userId: string, iat: number): Promise<WithId<DeviceDBType> | null> {
        return db.getCollections().security_devicesCollection
            .findOne({userId, lastActiveDate: iat})

    },

    async findDeviceById(deviceId: string): Promise<DeviceDBType | null> {
        return db.getCollections().security_devicesCollection
            .findOne({deviceId});
    },

    async updateIat(deviceId: string, iat: number): Promise<boolean> {
        const result = await db.getCollections().security_devicesCollection
            .updateOne(
                {deviceId},
                {$set: {lastActiveDate: iat}}
            );
        return result.modifiedCount === 1;
    },

    async deleteDevice(deviceId: string): Promise<boolean> {
        const result = await db.getCollections().security_devicesCollection
            .deleteOne({deviceId});
        return result.deletedCount === 1;
    },

    async deleteOtherDevices(userId: string, currentDeviceId: string): Promise<boolean> {
        const result = await db.getCollections().security_devicesCollection
            .deleteMany({
                userId,
                deviceId: {$ne: currentDeviceId}
            });
        return result.acknowledged;
    },

    async deleteExpiredDevices(): Promise<boolean> {
        const result = await db.getCollections().security_devicesCollection
            .deleteMany({
                expirationDate: {$lt: new Date().getTime()}
            });
        return result.acknowledged;
    }
} 