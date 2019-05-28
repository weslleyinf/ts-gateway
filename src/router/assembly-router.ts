import { Application, NextFunction, Response } from 'express';
import { IRouter } from './i-router';
import { readdir, readFile } from 'fs';
import { strict, rejects } from 'assert';

export class AssemblyRouter implements IRouter {
    constructor(private app: Application) { }

    async generatePipeline(req: Request, res: Response, next:NextFunction): Promise<any>{
        try{
            var controller = await this.getControllet(req.url);

            // this.app.use('/api', async (req, res, next) => {
            //     console.log('req: ');
            //     res.end();
            // })
        } catch(err) {
            return {message: err};
        }
    }

    private async getControllet(url: string): Promise<void|string> {
        const pathRoute: string[] = url.split('/');
        const FunctionName: string = pathRoute.pop() || '';

        return new Promise((resolve, reject) => {
            readFile('./src' + pathRoute.join('/'), (err, file) => {
                if(err) return reject('Caminho Não encontrado: ' + url)
                resolve();
            })
        })   
    }
}