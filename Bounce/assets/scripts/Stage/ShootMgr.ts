import { _decorator, Component, EventTouch, Input, input, Node, v3, Vec3, Graphics, UITransform, PhysicsSystem2D, ERaycast2DType, v2 } from 'cc';
import { UnitFactory } from '../Entity/UnitFactory';
import { DataManager } from '../Golbal/DataManager';
import Utils from '../Utils';
import GameConfig from '../Golbal/GameConfig';
const { ccclass, property } = _decorator;

@ccclass('ShootMgr')
export class ShootMgr extends Component {
    @property(Node)
    shootPoint: Node = null;

    @property(Graphics)
    trajectoryGraphics: Graphics = null;

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
        this.setLine();
    }

    async shoot() {
        if (this.isShooting) return;
        this.isShooting = true;
        if (this.trajectoryGraphics) {
            this.trajectoryGraphics.clear();
        }
        const { curBallNum } = DataManager.Instance;
        this._shootingBallCount = curBallNum;
        for (let i = 0; i < curBallNum; i++) {
            const ball = UnitFactory.Instance.CreateBall({ speed: GameConfig.BallSpeed.initialSpeed, dirPos: this._dir });
            ball.worldPosition = this.shootPoint.worldPosition;
            await Utils.delay(0.2);
        }
    }

    setLine() {
        if (!this.trajectoryGraphics) return;

        this.trajectoryGraphics.clear();

        const startWorldPos = this.shootPoint.worldPosition;
        // 设定射线的最大检测距离
        const distance = 2000;
        const endWorldPos = new Vec3(
            startWorldPos.x + this._dir.x * distance,
            startWorldPos.y + this._dir.y * distance,
            startWorldPos.z
        );

        // 物理射线检测，让虚线在碰到墙壁或方块时停止
        const p1 = v2(startWorldPos.x, startWorldPos.y);
        const p2 = v2(endWorldPos.x, endWorldPos.y);
        // 根据 GameConfig.CollisionGroup 的配置过滤，只检测墙壁(1)和方块(8)
        const mask = GameConfig.CollisionGroup.Wall | GameConfig.CollisionGroup.Block;
        const results = PhysicsSystem2D.instance.raycast(p1, p2, ERaycast2DType.Closest, mask);

        if (results && results.length > 0) {
            endWorldPos.x = results[0].point.x;
            endWorldPos.y = results[0].point.y;
        }

        // 将世界坐标转换到 Graphics 节点本身的局部坐标系下进行绘制
        const uiTrans = this.trajectoryGraphics.node.getComponent(UITransform);
        const startPos = uiTrans.convertToNodeSpaceAR(startWorldPos);
        const endPos = uiTrans.convertToNodeSpaceAR(endWorldPos);

        const dashLength = 20; // 实线段长度
        const gapLength = 15;  // 空白段长度
        const delta = new Vec3();
        Vec3.subtract(delta, endPos, startPos);
        const totalLength = delta.length();

        if (totalLength === 0) return;
        delta.normalize();

        let currentLen = 0;
        let isDraw = true;

        this.trajectoryGraphics.moveTo(startPos.x, startPos.y);

        while (currentLen < totalLength) {
            currentLen += isDraw ? dashLength : gapLength;
            if (currentLen > totalLength) currentLen = totalLength;

            const nextPos = new Vec3(
                startPos.x + delta.x * currentLen,
                startPos.y + delta.y * currentLen,
                0
            );

            if (isDraw) {
                this.trajectoryGraphics.lineTo(nextPos.x, nextPos.y);
            } else {
                this.trajectoryGraphics.moveTo(nextPos.x, nextPos.y);
            }

            isDraw = !isDraw;
        }
        this.trajectoryGraphics.stroke();
    }

    /**球越界时调用 */
    onBallOver(): void {
        this._shootingBallCount--;
        if (this._shootingBallCount <= 0) {
            this.isShooting = false;
            DataManager.Instance.gameMgr.generateBlocks();
            Utils.setGlobalTimeScale(1.0);
            DataManager.Instance.speedAddBtn.active = true;
        }
    }

    update(deltaTime: number) {

    }
}
