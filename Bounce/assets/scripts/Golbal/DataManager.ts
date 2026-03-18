import { _decorator, Component, Node } from "cc";
import Singleton from "../Base/Singleton";
import { ObjectPoolManager } from "./ObjectPoolManager";
import { ShootMgr } from "../Stage/ShootMgr";
import { GameMgr } from "../Stage/GameMgr";
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

    @property(GameMgr)
    gameMgr: GameMgr = null;

    protected start(): void {
        this.init();
    }

    init() {
        ObjectPoolManager.Instance.init();
        this.gameMgr.init();
    }

    public get shootDirPos() {
        return this.shootMgr.dir;
    }

    /**弹球场景底部边界 */
    public get stageBottomWorldPos() {
        return this.stage.getChildByPath('WallCollider/bottom').worldPosition;
    }

    /**弹球场景左边界 */
    public get stageLeftWorldPos() {
        return this.stage.getChildByPath('WallCollider/left').worldPosition;
    }

    /**弹球场景右边界 */
    public get stageRightWorldPos() {
        return this.stage.getChildByPath('WallCollider/right').worldPosition;
    }

}