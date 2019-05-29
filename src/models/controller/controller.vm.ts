import { IControllerViewModel } from "./i.controller.vm";

export class ControllerViewModel implements IControllerViewModel {
    method: string;
    exec: Function;

    constructor(obj: IControllerViewModel) { 
        Object.assign(this, obj);
    }
}

