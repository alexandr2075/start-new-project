import {WithId} from "mongodb";
import type {DeviceDBType} from "../../models/securityModels";
import {SecurityModel} from "../../domains/security.entity";

export const securityRepository = {
    async createDevice(device: DeviceDBType) {
        return SecurityModel
            .create(device);
    },

    async findDevices(userId: string): Promise<DeviceDBType[]> {
        return SecurityModel
            .find({userId})

    },

    async findDevicesByUserIdIat(userId: string, iat: number): Promise<WithId<DeviceDBType> | null> {
        return SecurityModel
            .findOne({userId, lastActiveDate: iat})

    },

    async findDeviceById(deviceId: string): Promise<DeviceDBType | null> {
        return SecurityModel
            .findOne({deviceId});
    },

    async updateIat(deviceId: string, iat: number): Promise<boolean> {
        const result = await SecurityModel
            .updateOne(
                {deviceId},
                {$set: {lastActiveDate: iat}}
            );
        return result.modifiedCount === 1;
    },

    async deleteDevice(deviceId: string): Promise<boolean> {
        const result = await SecurityModel
            .deleteOne({deviceId});
        return result.deletedCount === 1;
    },

    async deleteOtherDevices(userId: string, currentDeviceId: string): Promise<boolean> {
        const result = await SecurityModel
            .deleteMany({
                userId,
                deviceId: {$ne: currentDeviceId}
            });
        return result.acknowledged;
    },

    async deleteExpiredDevices(): Promise<boolean> {
        const result = await SecurityModel
            .deleteMany({
                expirationDate: {$lt: new Date().getTime()}
            });
        return result.acknowledged;
    }
} 