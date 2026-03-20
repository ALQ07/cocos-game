import { _decorator, Component, Node, Vec3 } from "cc";
import Singleton from "../Base/Singleton";
import { ObjectPoolManager } from "./ObjectPoolManager";
import { ShootMgr } from "../Stage/ShootMgr";
import { GameMgr } from "../Stage/GameMgr";
const { ccclass, property } = _decorator;

export interface blockRankInfo {
    blocks: Node[]   // 该排的所有块节点
    rowIndex: number // 排索引（0为底部，向上递增）
}

@ccclass('DataManager')
export class DataManager extends Component {
    private static _instance: DataManager = null;

    public static get Instance() {
        return DataManager._instance;
    }

    protected onLoad(): void {
        DataManager._instance = this;
    }

    private _curBallNum: number = 5;
    private _curMaxRows: number = 0;
    public blockRankList: Map<number, blockRankInfo> = new Map();

    @property(Node)
    stage: Node = null;

    @property(ShootMgr)
    shootMgr: ShootMgr = null;

    @property(GameMgr)
    gameMgr: GameMgr = null;

    protected start(): void {
        this.init();
    }

    async init() {
        await ObjectPoolManager.Instance.init();
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

    /**当前拥有的球的总数 */
    public get curBallNum() {
        return this._curBallNum;
    }

    public set curBallNum(value: number) {
        this.curBallNum = value;
    }

    /**当前块的最大行数 */
    public get curMaxRows() {
        return this._curMaxRows;
    }

    public set curMaxRows(value: number) {
        this._curMaxRows = value;
    }
}