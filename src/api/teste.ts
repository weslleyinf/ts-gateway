import { NextFunction, Response, Request } from 'express';
import { NodeViewModel } from "../models/node/node.vm";
import { INodeViewModel } from "../models/node/i.node.vm";
import { INodeOptionsViewModel } from "../models/node/I.node.optionvm";

export class TesteController {
    constructor() { }

    hit: INodeViewModel = new NodeViewModel({
        method: 'post',
        exec: (req: Request, res: Response, next:NextFunction) => {
            console.log('success!');
            next();
        }
    } as INodeOptionsViewModel);
}