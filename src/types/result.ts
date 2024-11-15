import {HTTP_STATUS} from "../settings";

export type ErrMessAndField = {
    message: string;
    field: string;
}

export type Result<T> = {
    status: HTTP_STATUS;
    data?: T;
    errorMessage?: string;
    errors?: ErrMessAndField[]
}
