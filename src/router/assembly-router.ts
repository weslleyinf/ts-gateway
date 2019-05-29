import { Application, NextFunction, Response, Request, Router } from 'express';
import { MiddlewareDictionary } from '../dictionary/middleware.dictionary';
import { INodeViewModel } from '../models/node/i.node.vm';
import { readFile } from 'fs';
import { IRouter } from './i.router';
import { of } from '../shared/utils';

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

            let [err4, middleware] = await of(this.getMiddleware(controller.middleware));
            if(err4) return reject({message: err4});

            middleware.push(controller.exec);
            const routerTo: string = req.baseUrl + req.url;
            this.app.get(routerTo, middleware);
            return resolve(routerTo);
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

    private async getMiddleware(middleware: string[]) {
        const middlewareKeys: string[] = Object.keys(MiddlewareDictionary);
        return Promise.all(middleware.map(x => 
            new Promise((resolve, reject) => {
                const index: number = middlewareKeys.indexOf(x);
                if(index == -1)  return reject('Micro serviço não encontrado');

                return resolve(MiddlewareDictionary[x]);
            })
        ));
    }
}