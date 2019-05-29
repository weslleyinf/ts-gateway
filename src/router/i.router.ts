import { NextFunction, Response, Request } from 'express';
export interface IRouter {
    generatePipeline(req: Request, res: Response, next:NextFunction): Promise<any>
}