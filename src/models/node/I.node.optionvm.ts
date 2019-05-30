import { RequestHandler } from "express-serve-static-core";

export interface INodeOptionsViewModel {
    method: string;
    middlewares: string[];
    exec: RequestHandler;
}