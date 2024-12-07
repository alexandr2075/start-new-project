interface ClientMeta {
    ip: string;
    userAgent: string;
}

interface UserDevice {
    id: string,
    deviceId?: string
}

declare global {
    declare namespace Express {
        export interface Request {
            user: UserDevice;
            clientMeta: ClientMeta;
        }
    }
}