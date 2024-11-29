import {IdType} from "./id";

declare global {
    declare namespace Express {
        export interface Request {
            user: { id: string };
        }
    }
}