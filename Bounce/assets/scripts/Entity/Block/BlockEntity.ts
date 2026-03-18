import { RigidBody2D, Vec2, Vec3 } from "cc";
import { Entity } from "../../Base/Entity";

export interface BlockParams {
    dirPos?: Vec3;
    speed?: number;
}

export class BlockEntity extends Entity {
    private rigidBody: RigidBody2D = null;

    private _speed: number = 0;
    private _dirPos: Vec3 = null;

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

    protected onLoad(): void {
        this.rigidBody = this.node.getComponent(RigidBody2D);
    }

    init(params: BlockParams): void {
        // this._speed = params.speed;
        // this._dirPos = params.dirPos

    }

    protected update(dt: number): void {
        // const currentPos = this.node.position.clone();
        // const delta = this._dirPos.clone().multiplyScalar(this._speed * dt);
        // this.node.position = currentPos.add(delta);
    }
}