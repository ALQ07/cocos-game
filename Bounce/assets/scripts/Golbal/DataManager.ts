import { _decorator, Component, Node, Vec3, PhysicsSystem2D, Label, tween, director, PhysicsSystem } from "cc";
import Singleton from "../Base/Singleton";
import { ObjectPoolManager } from "./ObjectPoolManager";
import { ShootMgr } from "../Stage/ShootMgr";
import { GameMgr } from "../Stage/GameMgr";
import GM from "../../GM/GM";
import { excel } from "../../GM/DataMgr/ExcelData/excel";
import { WxCloudManager } from "./WxCloudManager";
const { ccclass, property } = _decorator;

declare const wx: any;
declare const canvas: any;

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

    private _gameSpeed: number = 1;

    private _curMaxRows: number = 0;
    public blockRankList: Map<number, blockRankInfo> = new Map();

    @property(Node)
    speedAddBtn: Node = null;

    @property(Node)
    stage: Node = null;

    @property(ShootMgr)
    shootMgr: ShootMgr = null;

    @property(GameMgr)
    gameMgr: GameMgr = null;

    @property(Label)
    scoreLabel: Label = null;

    protected start(): void {
        this.init();
    }

    async init() {
        this.initData();
        await ObjectPoolManager.Instance.init();
        this.gameMgr.init();
    }

    initData() {
        this.Score = GM.CacheMgr.get<number>('score') || 0;
        this.Round = GM.CacheMgr.get<number>('round') || 1;
        this.curBallNum = GM.CacheMgr.get<number>('curBallNum') || 1;
    }

    public get shootDirPos() {
        return this.shootMgr.dir;
    }

    public get Score() {
        return GM.CacheMgr.get<number>('score') || 0;
    }

    public set Score(value: number) {
        GM.CacheMgr.set('score', value);
        this.scoreLabel.string = `${value}`;
    }

    public get Round() {
        return GM.CacheMgr.get<number>('round') || 1;
    }

    public set Round(value: number) {
        GM.CacheMgr.set('round', value);
        // 您如果需要在UI上显示回合数，可以在这里更新UI
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
        return GM.CacheMgr.get<number>('curBallNum') || 1;
    }

    public set curBallNum(value: number) {
        GM.CacheMgr.set('curBallNum', value);
        // 如果需要更新UI（比如顶部显示当前拥有的球数），可以在这里加上 UI 更新逻辑
    }

    /**当前块的最大行数 */
    public get curMaxRows() {
        return this._curMaxRows;
    }

    public set curMaxRows(value: number) {
        this._curMaxRows = value;
    }


    protected update(dt: number): void {

    }
}