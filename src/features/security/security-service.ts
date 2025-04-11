import {securityRepository} from "./security-repository";
import type {DeviceViewModel} from "../../models/securityModels";
import {HTTP_STATUS} from "../../settings";
import {Result} from "../../types/result";

export const securityService = {
    // async createDevice(userId: string, ip: string, userAgent: string, expirationDate: Date): Promise<string> {
    //
    //     const lastActiveDate = new Date();
    //     // const expirationDate = add(lastActiveDate, {days: 20});
    //
    //     const device: DeviceDBType = {
    //         deviceId,
    //         userId,
    //         ip,
    //         title: userAgent || 'Unknown device',
    //         expirationDate
    //     };
    //
    //     await securityRepository.createDevice(device);
    //     return deviceId;
    // },

    async getDevices(userId: string): Promise<DeviceViewModel[]> {
        const devices = await securityRepository.findDevices(userId);
        return devices.map(d => ({
            ip: d.ip,
            title: d.title,
            lastActiveDate: d.lastActiveDate,
            deviceId: d.deviceId
        }));
    },

    async updateIat(deviceId: string, iat: number): Promise<boolean> {
        return securityRepository.updateIat(deviceId, iat);
    },

    async deleteDevice(deviceId: string, userId: string): Promise<Result<null>> {
        const device = await securityRepository.findDeviceById(deviceId);
        if (!device) {
            return {
                status: HTTP_STATUS.NOT_FOUND
            }
        }
        if (device.userId !== userId) {
            return {
                status: HTTP_STATUS.FORBIDDEN
            }
        }
        const isDeleted = await securityRepository.deleteDevice(deviceId);
        if (isDeleted) {
            return {
                status: HTTP_STATUS.NO_CONTENT
            }
        } else {
            return {
                status: HTTP_STATUS.NOT_FOUND
            }
        }
    },

    async deleteOtherDevices(userId: string, currentDeviceId: string): Promise<boolean> {
        return securityRepository.deleteOtherDevices(userId, currentDeviceId);
    }
} 