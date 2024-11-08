import {Request} from "express";

export type ReqWithQuery<T> = Request<{}, {}, {}, T>
export type ReqWithParams<P> = Request<P, {}, {}, {}>
export type ReqWithParamsAndQuery<P, Q> = Request<P, {}, {}, Q>