import { Application, NextFunction, Response, Request, Router } from 'express';
import  httpProxy from 'express-http-proxy';
import { RequestHandler } from 'express-serve-static-core';

const baseServiceProxy: RequestHandler = httpProxy('http://127.0.0.1:3000/', {
    proxyReqPathResolver: () => 'teste',
});

export const MiddlewareDictionary: any = {
    'teste': async (req: any, res: Response, next:NextFunction) => {
        const reqOpts = await baseServiceProxy(req, res, next);
        req['teste'] = reqOpts;
        console.log('teste');
        next();
    }
}