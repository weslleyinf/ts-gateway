import { ControllerViewModel } from "../models/controller/controller.vm";
import { IControllerViewModel } from "../models/controller/i.controller.vm";

export class TesteController {
    constructor() { }

    getTeste: IControllerViewModel = new ControllerViewModel({
        method: 'GET',
        exec: () => {
            console.log('success!');
        }
    } as IControllerViewModel);
}