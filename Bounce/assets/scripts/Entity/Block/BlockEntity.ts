import { BoxCollider2D, CircleCollider2D, Contact2DType, Label, PolygonCollider2D, RigidBody2D, Vec3 } from "cc";
import { Entity } from "../../Base/Entity";
import { ColliderType } from "../../Enum";
import { ObjectPoolManager } from "../../Golbal/ObjectPoolManager";

export interface BlockParams {
    colliderType?: ColliderType;
}

export class BlockEntity extends Entity {
    private rigidBody: RigidBody2D = null;
    private collider: ColliderType;
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
        this.nLabel.string = `${value}`;
    }

    protected onLoad(): void {
        this.rigidBody = this.node.getComponent(RigidBody2D);
        this.nLabel = this.node.getChildByName('Label').getComponent(Label);
    }

    protected onDestroy(): void {
        this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        this.collider.off(Contact2DType.END_CONTACT, this.onEndContact, this);
    }

    init(params: BlockParams): void {
        const angle = Math.random() * 360;
        if (this.node.children.length > 0) {
            const graphic = this.node.children[0];
            graphic.angle = angle;
        } else {
            this.node.angle = angle;
        }
        this.curNum = 50;
        this.nLabel.string = `${this.curNum}`;

        this.collider = this.node.getComponentInChildren(PolygonCollider2D);

        // 监听碰撞回调
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        this.collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
    }

    /**
     * 碰撞开始回调
     * @param contact 碰撞信息
     * @param selfCollider 自身的碰撞器
     * @param otherCollider 碰撞对象的碰撞器
     */
    onBeginContact(contact: any, selfCollider: any, otherCollider: any): void {
        // console.log(`BlockEntity: ${this.node.name} 碰撞开始 with ${otherCollider.node.name}`);
        this.curNum -= 1;
        if (this.curNum <= 0) {
            ObjectPoolManager.Instance.ret(this.node);
        }
    }

    /**
     * 碰撞结束回调
     * @param selfCollider 自身的碰撞器
     * @param otherCollider 碰撞对象的碰撞器
     */
    onEndContact(selfCollider: any, otherCollider: any): void {
        // console.log(`BlockEntity: ${this.node.name} 碰撞结束 with ${otherCollider.node.name}`);
    }

    protected update(dt: number): void {
        // const currentPos = this.node.position.clone();
        // const delta = this._dirPos.clone().multiplyScalar(this._speed * dt);
        // this.node.position = currentPos.add(delta);
    }
}