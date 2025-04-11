export type DeviceDBType = {
    deviceId: string;
    userId: string;
    ip: string;
    title: string;
    lastActiveDate: Date,
    expirationDate: Date;
}

export type DeviceViewModel = {
    ip: string;
    title: string;
    lastActiveDate: Date;
    deviceId: string;
}