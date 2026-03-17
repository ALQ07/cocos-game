import { _decorator, Component } from "cc";

const { ccclass, property } = _decorator;

@ccclass("Entity")
export abstract class Entity extends Component {


    abstract init(...args: any[]): void;
}