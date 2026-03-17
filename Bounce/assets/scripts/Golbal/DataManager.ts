import { _decorator, Component, Node } from "cc";
import Singleton from "../Base/Singleton";
import { ObjectPoolManager } from "./ObjectPoolManager";
import { ShootMgr } from "../Stage/ShootMgr";
const { ccclass, property } = _decorator;

@ccclass('DataManager')
export class DataManager extends Component {
    private static _instance: DataManager = null;

    public static get Instance() {
        return DataManager._instance;
    }

    protected onLoad(): void {
        DataManager._instance = this;
    }

    @property(Node)
    stage: Node = null;

    @property(ShootMgr)
    shootMgr: ShootMgr = null;

    protected start(): void {
        this.init();
    }

    init() {
        ObjectPoolManager.Instance.init();
    }

    public get shootDirPos() {
        return this.shootMgr.dir;
    }
}