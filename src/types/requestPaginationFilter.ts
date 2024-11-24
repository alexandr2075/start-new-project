import {Request} from "express";
import {ParsedQs} from "qs";
import {IdType} from "./id";

export type ReqWithQuery<T> = Request<{}, {}, {}, T>
export type ReqWithParams<P> = Request<P, {}, {}, {}>
export type ReqWithParamsAndQuery<P, Q> = Request<P, {}, {}, Q & ParsedQs>

export type RequestWithParamsAndBodyAndUserId<P, B, U extends IdType> = Request<P, {}, B, {}, U>;
export type RequestWithBodyAndUserId<B, U extends IdType> = Request<{}, {}, B, {}, U>;
export type RequestWithUserId<U extends IdType> = Request<{}, {}, {}, {}, U>;