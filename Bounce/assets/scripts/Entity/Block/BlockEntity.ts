import { BoxCollider2D, CircleCollider2D, Collider2D, Contact2DType, IPhysics2DContact, Label, PolygonCollider2D, RigidBody2D, Vec3, tween, v3, Tween, Sprite } from "cc";
import { Entity } from "../../Base/Entity";
import { ObjectPoolManager } from "../../Golbal/ObjectPoolManager";
import { BlockShape, ColliderType, EntityTypeEnum } from "../../Enum";
import { UnitFactory } from "../UnitFactory";
import Utils from "../../Utils";
import { DataManager } from "../../Golbal/DataManager";

export interface BlockParams {
    shape?: BlockShape
    hp?: number
}

export class BlockEntity extends Entity {
    private rigidBody: RigidBody2D = null;
    private sprite: Sprite = null;
    private collider: ColliderType;
    private _shape: BlockShape;
    private nLabel: Label = null;

    private _speed: number = 0;
    private _dirPos: Vec3 = null;
    private _curNum: number = 0;

    public set speed(v: number) {
        this._speed = v;
    }

    public get speed() {
        return this._speed;
    }

    public get dirPos() {
        return this._dirPos;
    }

    public set dirPos(value: Vec3) {
        this._dirPos = value;
    }

    public get curNum() {
        return this._curNum;
    }

    public set curNum(value: number) {
        this._curNum = value;
        if (this._shape !== BlockShape.Blind) {
            this.nLabel.string = `${value}`;
        }
    }

    protected onLoad(): void {
        this.rigidBody = this.node.getComponent(RigidBody2D);
        this.nLabel = this.node.getChildByName('Label').getComponent(Label);
        this.sprite = this.node.getComponentInChildren(Sprite);
    }

    protected onDestroy(): void {
        this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        this.collider.off(Contact2DType.END_CONTACT, this.onEndContact, this);
    }

    init(params: BlockParams): void {
        this._shape = params.shape;
        this.setSpriteFrame(params.shape);
        const angle = Math.random() * 360;

        Tween.stopAllByTarget(this.node);
        this.node.setScale(v3(1, 1, 1));

        // [修复] 必须同时重置 Sprite 节点的缩放，否则从对象池取出的方块会一直隐身
        if (this.sprite) {
            Tween.stopAllByTarget(this.sprite.node);
            this.sprite.node.setScale(v3(1, 1, 1));
        }

        // 使用更通用的 getComponent 获取当前节点挂载的任何一种 Collider2D (Box/Polygon/Circle)
        this.collider = this.node.getComponentInChildren(Collider2D) as ColliderType;
        if (this.collider) {
            this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            this.collider.off(Contact2DType.END_CONTACT, this.onEndContact, this);
            // 如果是道具块，将其设置为触发器(Sensor)，让球可以直接穿过而不发生物理反弹
            this.collider.sensor = (this._shape === BlockShape.Blind);

            // 监听碰撞回调
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            this.collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }

        if (params.shape == BlockShape.Blind) {
            this.curNum = 1;
        } else {
            this.curNum = params.hp ?? 10;
            if (this.node.children.length > 0) {
                const graphic = this.node.children[0];
                graphic.angle = angle;
                this.collider.node.angle = angle;
            } else {
                this.node.angle = angle;
            }
        }
    }

    /**
     * 碰撞开始回调
     * @param contact 碰撞信息
     * @param selfCollider 自身的碰撞器
     * @param otherCollider 碰撞对象的碰撞器
     */
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact): void {
        // console.log(`BlockEntity: ${this.node.name} 碰撞开始 with ${otherCollider.node.name}`);

        if (this.curNum <= 0) return;

        this.curNum -= 1;

        if (this._shape === BlockShape.Blind) {
            // 拾取道具：下回合球数+1，不增加分数
            DataManager.Instance.curBallNum += 1;
        } else {
            // 普通块被击中：扣除血量，增加得分
            DataManager.Instance.Score += 1;
        }

        if (this.curNum > 0) {
            // 播放果冻摇晃动画
            Tween.stopAllByTarget(this.sprite.node);
            this.sprite.node.setScale(v3(1, 1, 1));
            tween(this.sprite.node)
                .to(0.06, { scale: v3(1.2, 0.8, 1) })
                .to(0.06, { scale: v3(0.8, 1.2, 1) })
                .to(0.06, { scale: v3(1.05, 0.95, 1) })
                .to(0.06, { scale: v3(1, 1, 1) })
                .start();
        }

        if (this.curNum <= 0) {
            this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            this.collider.off(Contact2DType.END_CONTACT, this.onEndContact, this);

            // 播放爆炸碎片粒子特效
            const effect = UnitFactory.Instance.CreateEffect('BlockExplosion');
            effect.worldPosition = this.node.worldPosition;

            Tween.stopAllByTarget(this.sprite.node);
            // 优化消失效果：在0.1秒内迅速缩小到0，然后再回收到对象池
            tween(this.sprite.node)
                .to(0.1, { scale: v3(0, 0, 0) })
                .call(() => {
                    ObjectPoolManager.Instance.ret(this.node);
                })
                .start();
        }
    }

    /**
     * 碰撞结束回调
     * @param selfCollider 自身的碰撞器
     * @param otherCollider 碰撞对象的碰撞器
     */
    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D): void {
        // console.log(`BlockEntity: ${this.node.name} 碰撞结束 with ${otherCollider.node.name}`);
    }

    setSpriteFrame(shape?: BlockShape) {
        if (shape !== undefined) {
            const random = Math.floor(Math.random() * 6);
            const path = `Sprites/block/${shape}/${random}`;
            Utils.setSpriteFrame(this.sprite, path);
        }
    }

    protected update(dt: number): void {
        // const currentPos = this.node.position.clone();
        // const delta = this._dirPos.clone().multiplyScalar(this._speed * dt);
        // this.node.position = currentPos.add(delta);
    }
}