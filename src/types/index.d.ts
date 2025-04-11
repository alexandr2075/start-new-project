interface ClientMeta {
    ip: string;
    userAgent: string;
}

interface UserDevice {
    id: string,
    deviceId?: string
}

declare global {
    namespace Express {
        interface Request {
            user: UserDevice;
            clientMeta: ClientMeta;
        }
    }
}

export {};