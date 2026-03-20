import { _decorator, Component, EventTouch, Input, input, Node, v3, Vec3 } from 'cc';
import { UnitFactory } from '../Entity/UnitFactory';
import { DataManager } from '../Golbal/DataManager';
import Utils from '../Utils';
const { ccclass, property } = _decorator;

@ccclass('ShootMgr')
export class ShootMgr extends Component {
    @property(Node)
    shootPoint: Node = null;

    public isShooting: boolean = false;

    /**正在飞行的球数量 */
    private _shootingBallCount: number = 0;

    private _dir = new Vec3();

    public get dir(): Vec3 {
        return this._dir;
    }

    protected onLoad(): void {
        this.node.parent.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.parent.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.parent.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.parent.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchEnd(event: EventTouch): void {
        this.shoot();
    }

    protected onTouchStart(event: EventTouch): void {
        this.calculateAngle(event);
    }

    protected onTouchMove(event: EventTouch): void {
        this.calculateAngle(event);
    }

    calculateAngle(event: EventTouch) {
        if (this.isShooting) return;
        const uiLocation = event.getUILocation();
        const originPos = this.node.worldPosition;
        const dx = uiLocation.x - originPos.x;
        const dy = uiLocation.y - originPos.y;
        const radians = Math.atan2(dx, -dy);
        const angle = radians * 180 / Math.PI;
        if (Math.abs(angle) > 80) return;
        this.node.angle = angle;
        this._dir = Utils.getUnitVector(originPos, v3(uiLocation.x, uiLocation.y, 0));
    }

    async shoot() {
        if (this.isShooting) return;
        this.isShooting = true;
        const { curBallNum } = DataManager.Instance;
        this._shootingBallCount = curBallNum;
        for (let i = 0; i < curBallNum; i++) {
            const ball = UnitFactory.Instance.CreateBall({ speed: 50, dirPos: this._dir });
            ball.worldPosition = this.shootPoint.worldPosition;
            await Utils.delay(0.2);
        }
    }

    /**球越界时调用 */
    onBallOver(): void {
        this._shootingBallCount--;
        if (this._shootingBallCount <= 0) {
            this.isShooting = false;
            DataManager.Instance.gameMgr.generateBlocks();
        }
    }

    update(deltaTime: number) {

    }
}



