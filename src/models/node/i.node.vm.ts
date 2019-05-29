import { INodeOptionsViewModel } from "./I.node.optionvm";

export interface INodeViewModel extends INodeOptionsViewModel {
    getMethod(): string;
}