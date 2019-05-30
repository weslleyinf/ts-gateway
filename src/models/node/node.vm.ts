import { INodeViewModel } from "./i.node.vm";
import { INodeOptionsViewModel } from "./I.node.optionvm";
import { RequestHandler } from "express-serve-static-core";

export class NodeViewModel implements INodeViewModel, INodeOptionsViewModel {
    method: any;
    middlewares: string[];
    exec: RequestHandler;

    constructor(material: INodeOptionsViewModel) { 
        this.method = material.method;
        this.middlewares = material.middlewares;
        this.exec = material.exec;
    }

    getMethod(): string{
        return this.method.toUpperCase();
    };
}

