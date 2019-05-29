import { INodeViewModel } from "./i.node.vm";
import { INodeOptionsViewModel } from "./I.node.optionvm";

export class NodeViewModel implements INodeViewModel {
    method: any;
    exec: Function;

    constructor(material: INodeOptionsViewModel) { 
        this.method = material.method;
        this.exec = material.exec;
    }

    getMethod(): string{
        return this.method.toUpperCase();
    };
}

