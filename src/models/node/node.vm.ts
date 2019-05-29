import { INodeViewModel } from "./i.node.vm";
import { INodeOptionsViewModel } from "./I.node.optionvm";

export class NodeViewModel implements INodeViewModel, INodeOptionsViewModel {
    method: any;
    middleware: string[];
    exec: Function;

    constructor(material: INodeOptionsViewModel) { 
        this.method = material.method;
        this.middleware = material.middleware;
        this.exec = material.exec;
    }

    getMethod(): string{
        return this.method.toUpperCase();
    };
}

