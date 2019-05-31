import { Application, NextFunction, Response, Request, Router } from 'express';
import { MiddlewareDictionary } from '../dictionary/middleware.dictionary';
import { readFile } from 'fs';
import { IRouter } from './i.router';
import { of } from '../shared/utils';
import { NodeViewModel } from '../models/node/node.vm';

export class AssemblyRouter implements IRouter {
    constructor(private app: Application) { }

    async generatePipeline(req: any, res: Response, next:NextFunction): Promise<any>{
        return new Promise(async (resolve, reject) => {
            let err: string;
            // console.log(req.originalUrl);
            const urlParts: string[] = req.url.split('/');
            const methodName: string = urlParts.pop() || '';

            let pathUrl: string;
            [err, pathUrl] = await of(this.GetPathUrl(req.baseUrl, urlParts));
            if(err) return reject({message: err});

            let file: any;
            [err, file] = await of(import(pathUrl));
            if(err) return reject({message: err});
            
            let controller: NodeViewModel;
            [err, controller] = await of(this.getController(file, methodName));
            if(err) return reject({message: err});

            if(controller.getMethod() != req.method) 
                return reject({message: 'Método incorreto'});

            let middlewares: [any];
            [err, middlewares] = await of(this.getMiddleware(controller.middlewares));
            if(err) return reject({message: err});

            middlewares.push(controller.exec);
            const routerTo: string = req.baseUrl + req.url;

            req['originUrl'] = req.url;
            this.app.use(routerTo, middlewares);
            return resolve();
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

    private async getController(file: any, method: string): Promise<NodeViewModel|string> {
        return new Promise((resolve, reject) => {
            const keys: string[] = Object.keys(file);
            if(!keys || keys.length == 0) return reject('Arquivo vazio');

            const controller: any = new file[keys[0]]();
            if(!controller) return reject('Classe não encontrada');

            const controlerKeys = Object.keys(controller);
            const index: number = controlerKeys.indexOf(method);
            if(index == -1) return reject('Request não encontrada');

            resolve(controller[controlerKeys[index]] as NodeViewModel);
        });
    }

    private async getMiddleware(middlewares: string[]): Promise<string|{}[]> {
        if(!middlewares || middlewares.length == 0) return Promise.resolve([]);

        const middlewareKeys: string[] = Object.keys(MiddlewareDictionary);
        return Promise.all(middlewares.map(x => 
            new Promise((resolve, reject) => {
                const index: number = middlewareKeys.indexOf(x);
                if(index == -1)  return reject('Micro serviço não encontrado');

                return resolve(MiddlewareDictionary[x]);
            })
        ));
    }
}