import { _decorator, Component, EventTouch, Input, input, Node, v3, Vec3, Graphics, UITransform, PhysicsSystem2D, ERaycast2DType, v2, Label } from 'cc';
import { UnitFactory } from '../Entity/UnitFactory';
import { DataManager } from '../Golbal/DataManager';
import Utils from '../Utils';
import GameConfig from '../Golbal/GameConfig';
const { ccclass, property } = _decorator;

@ccclass('ShootMgr')
export class ShootMgr extends Component {
    @property(Node)
    shootPoint: Node = null;

    @property(Node)
    settingBtn: Node = null;

    @property(Graphics)
    trajectoryGraphics: Graphics = null;

    @property(Label)
    ballNumLabel: Label = null;

    public static _instance: ShootMgr = null;
    public static get Instance() {
        return ShootMgr._instance;
    }

    public isShooting: boolean = false;
    private canShoot: boolean = false;

    /**正在飞行的球数量 */
    private _shootingBallCount: number = 0;

    public set shootingBallCount(value: number) {
        this._shootingBallCount = value;
    }

    public get shootingBallCount() {
        return this._shootingBallCount;
    }


    private _dir = new Vec3();

    public get dir(): Vec3 {
        return this._dir;
    }

    protected onLoad(): void {
        ShootMgr._instance = this;
        DataManager.Instance.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        DataManager.Instance.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        DataManager.Instance.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        DataManager.Instance.node.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.ballNumLabel.string = DataManager.Instance.curBallNum.toString();
    }

    protected onDestroy(): void {
        if (DataManager.Instance && DataManager.Instance.node) {
            DataManager.Instance.node.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
            DataManager.Instance.node.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
            DataManager.Instance.node.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
            DataManager.Instance.node.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        }
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

        // 1. 将手指坐标转换到炮台的同一局部坐标系下，彻底免疫各种全面屏/宽屏的适配缩放畸变
        const uiTrans = this.node.parent.getComponent(UITransform);
        const touchLocal = uiTrans.convertToNodeSpaceAR(v3(uiLocation.x, uiLocation.y, 0));
        const originLocal = this.node.position;

        const dx = touchLocal.x - originLocal.x;
        const dy = touchLocal.y - originLocal.y;
        const radians = Math.atan2(dx, -dy);
        const angle = radians * 180 / Math.PI;
        if (Math.abs(angle) > 80) return;
        this.canShoot = true;
        this.node.angle = angle;

        // 2. 直接根据旋转弧度计算出绝对物理方向，无视距离长短，杜绝任何坐标刷新滞后造成的平行线偏移
        this._dir.x = Math.sin(radians);
        this._dir.y = -Math.cos(radians);
        this._dir.z = 0;
        this._dir.normalize();

        this.setLine();
    }

    shoot() {
        if (this.isShooting) return;
        if (!this.canShoot) return;
        this.canShoot = false;
        this.isShooting = true;
        this.settingBtn.active = false;

        if (this.trajectoryGraphics) {
            this.trajectoryGraphics.clear();
        }

        const { curBallNum } = DataManager.Instance;
        this._shootingBallCount = curBallNum;

        let shootCount = 0;
        const fireOneBall = () => {
            if (!this.isValid) return; // 检查节点是否已被销毁，防止报错
            this.ballNumLabel.string = (curBallNum - shootCount - 1).toString();
            const ball = UnitFactory.Instance.CreateBall({ speed: GameConfig.BallSpeed.initialSpeed, dirPos: this._dir });
            if (ball) ball.worldPosition = this.shootPoint.worldPosition;
            shootCount++;
        };

        // 立即发射第一颗球
        fireOneBall();
        if (curBallNum > 1) {
            this.schedule(fireOneBall, 0.2, curBallNum - 2, 0);
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
        const mask = GameConfig.CollisionGroup.Wall | GameConfig.CollisionGroup.Block | GameConfig.CollisionGroup.Cream;
        const results = PhysicsSystem2D.instance.raycast(p1, p2, ERaycast2DType.Closest, mask);

        if (results && results.length > 0) {
            endWorldPos.x = results[0].point.x;
            endWorldPos.y = results[0].point.y;
        }

        // 将世界坐标转换到 Graphics 节点本身的局部坐标系下进行绘制
        const uiTrans = this.trajectoryGraphics.node.getComponent(UITransform);
        const startPos = uiTrans.convertToNodeSpaceAR(startWorldPos);
        const endPos = uiTrans.convertToNodeSpaceAR(endWorldPos);

        const delta = new Vec3();
        Vec3.subtract(delta, endPos, startPos);
        const totalLength = delta.length();

        if (totalLength === 0) return;
        delta.normalize();

        const dotSpacing = 70; // 点与点之间的间距
        const dotRadius = 8;   // 小圆点的半径
        let currentLen = 0;

        // 提取循环外的临时变量，彻底杜绝 while 内部由于 new 造成的内存碎片和 GC 压力
        let dotPosX = 0;
        let dotPosY = 0;

        while (currentLen < totalLength) {
            dotPosX = startPos.x + delta.x * currentLen;
            dotPosY = startPos.y + delta.y * currentLen;
            this.trajectoryGraphics.circle(dotPosX, dotPosY, dotRadius);
            currentLen += dotSpacing;
        }
        this.trajectoryGraphics.fill();
    }

    /**球越界时调用 */
    onBallOver(): void {
        this._shootingBallCount--;
        if (this._shootingBallCount <= 0) {
            this.isShooting = false;
            this.settingBtn.active = true;
            DataManager.Instance.gameMgr.generateBlocks();
            Utils.setGlobalTimeScale(1.0);
            DataManager.Instance.speedAddBtn.active = true;
            this.ballNumLabel.string = DataManager.Instance.curBallNum.toString();
        }
    }

    update(deltaTime: number) {

    }
}
