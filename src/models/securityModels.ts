export type DeviceDBType = {
    deviceId: string;
    userId: string;
    ip: string;
    title: string;
    lastActiveDate: number,// user-agent
    expirationDate: number;
}

export type DeviceViewModel = {
    ip: string;
    title: string;
    lastActiveDate: string;
    deviceId: string;
}