import { Vec3 } from "cc";
import { Entity } from "../../Base/Entity";
import { DataManager } from "../../Golbal/DataManager";

export interface BallParams {
    dirPos?: Vec3;
    speed?: number;
}

export class BallEntity extends Entity {

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

    init(params: BallParams): void {
        this._speed = params.speed;
        this._dirPos = params.dirPos
    }

    protected update(dt: number): void {
        const currentPos = this.node.position.clone();
        const delta = this._dirPos.clone().multiplyScalar(this._speed * dt);
        this.node.position = currentPos.add(delta);
    }
}