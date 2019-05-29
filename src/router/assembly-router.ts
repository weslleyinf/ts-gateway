import { Application, NextFunction, Response, Request } from 'express';
import { readFile } from 'fs';
import { IRouter } from './i.router';
import { of } from '../shared/utils';

export class AssemblyRouter implements IRouter {
    constructor(private app: Application) { }

    async generatePipeline(req: Request, res: Response, next:NextFunction): Promise<any>{
        return new Promise(async (resolve, reject) => {
            let [err, pathUrl] = await of(this.GetPathUrl(req.url));
            if(err) return reject({message: err});

            let [err2, file] = await of(import(pathUrl));
            if(err2) return reject({message: err2});

            return resolve();
            // this.app.use('/api', async (req, res, next) => {
            //     console.log('req: ');
            //     res.end();
            // })
        });
    }

    private async GetPathUrl(url: string): Promise<any> {
        const urlParts: string[] = url.split('/');
        urlParts.pop();

        const pathRoute = './src' + urlParts.join('/') + '.ts';
        return new Promise((resolve, reject) => {
            readFile(pathRoute, (err) => {
                if(err) return reject('Caminho não encontrado');
                return resolve();
            })
        })   
    }
}