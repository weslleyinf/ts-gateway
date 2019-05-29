import { Application, NextFunction, Response, Request } from 'express';
import { readFile } from 'fs';
import { IRouter } from './i.router';
import { of } from '../shared/utils';
import { INodeViewModel } from '../models/node/i.node.vm';
import { TesteController } from '../api/teste';
import { NodeViewModel } from '../models/node/node.vm';

export class AssemblyRouter implements IRouter {
    constructor(private app: Application) { }

    async generatePipeline(req: Request, res: Response, next:NextFunction): Promise<any>{
        return new Promise(async (resolve, reject) => {
            const urlParts: string[] = req.url.split('/');
            const methodName: string = urlParts.pop() || '';

            let [err, pathUrl] = await of(this.GetPathUrl(req.baseUrl, urlParts));
            if(err) return reject({message: err});

            let [err2, file] = await of(import(pathUrl));
            if(err2) return reject({message: err2});
            
            let [err3, controller] = await of(this.getController(file, methodName));
            if(err3) return reject({message: err3});

            if(controller.getMethod() != req.method) 
                return reject({message: 'Método incorreto'});

            // this.app[application[controller.method]]('/', controller.exec);
            return resolve();
            // this.app.use('/api', async (req, res, next) => {
            //     console.log('req: ');
            //     res.end();
            // })
        });
    }

    private async GetPathUrl(base: string, nodeList: string[]): Promise<string> {
        const pathRoute =  nodeList.join('/');
        return new Promise((resolve, reject) => {
            readFile('./src' + base + pathRoute + '.ts', (err) => {
                if(err) return reject('Caminho não encontrado');
                return resolve('..' + base + pathRoute);
            })
        })   
    }

    private async getController(file: any, method: string): Promise<INodeViewModel|string> {
        return new Promise((resolve, reject) => {
            const keys: string[] = Object.keys(file);
            if(!keys || keys.length == 0) return reject('Arquivo vazio');

            const controller: any = new file[keys[0]]();
            if(!controller) return reject('Classe não encontrada');

            const controlerKeys = Object.keys(controller);
            const index: number = controlerKeys.indexOf(method);
            if(index == -1) return reject('Request não encontrada');

            resolve(controller[controlerKeys[index]] as INodeViewModel);
        });
    }
}