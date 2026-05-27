import { CircleCollider2D, Collider2D, Contact2DType, IPhysics2DContact, RigidBody2D, Sprite, Vec2, Vec3, tween, v3, Tween, SpriteFrame } from "cc";
import { Entity } from "../../Base/Entity";
import { DataManager } from "../../Golbal/DataManager";
import { ObjectPoolManager } from "../../Golbal/ObjectPoolManager";
import GameConfig from "../../Golbal/GameConfig";
import Utils from "../../Utils";
import { ColliderType } from "../../Enum";
import { UnitFactory } from "../UnitFactory";
import GM from "../../../GM/GM";

export interface BallParams {
    dirPos?: Vec3;
    speed?: number;
}

export class BallEntity extends Entity {
    private rigidBody: RigidBody2D = null;
    private sprite: Sprite = null;
    private collider: ColliderType;

    private _speed: number = 0;
    private _dirPos: Vec3 = null;
    private _hasCollider: boolean = false;
    private _timeElapsed: number = 0;

    private static lastHitSoundTime: number = 0;

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

    }

    init(params: BallParams): void {
        this.rigidBody = this.node.getComponent(RigidBody2D);
        this.sprite = this.node.getComponent(Sprite);

        // 重置小球的缩放和缓动状态，防止从对象池取出时因之前的动画导致状态异常
        Tween.stopAllByTarget(this.node);
        this.node.setScale(v3(1, 1, 1));

        this._speed = params.speed;
        this._dirPos = params.dirPos
        const delta = this._dirPos.clone().multiplyScalar(this._speed);
        this.rigidBody.linearVelocity = new Vec2(delta.x, delta.y);
        this.rigidBody.gravityScale = 0;
        this._hasCollider = false;
        this._timeElapsed = 0;


        // 给小球一个随机的初始角速度（旋转），让它一发射就带着自转
        // 旋转方向随机（正数为逆时针，负数为顺时针）
        const randomSign = Math.random() > 0.5 ? 1 : -1;
        const randomAngularSpeed = 20 + Math.random() * 30;
        this.rigidBody.angularVelocity = randomAngularSpeed * randomSign;
        // 初始角度依然归零，保证每次出场姿态一致
        this.node.angle = 0;

        // 重置刚体的阻尼，防止从对象池复用时依然保留着上次触碰奶油时的减速效果
        this.rigidBody.linearDamping = GameConfig.Ball.linearDamping;
        this.rigidBody.angularDamping = GameConfig.Ball.angularDamping;

        this.setSpriteFrame();

        this.collider = this.node.getComponent(CircleCollider2D);
        // 先移除监听，防止重复添加
        this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        this.collider.off(Contact2DType.END_CONTACT, this.onEndContact, this);
        // 监听碰撞回调
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        this.collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
    }

    protected update(dt: number): void {
        if (this.node.active) {
            this._timeElapsed += dt;
            //避免每帧都获取 linearVelocity 造成过多 Vec2 对象的内存分配（GC）和 CPU 负担
            if (this._timeElapsed < 1.5) return;
            this._timeElapsed = 0;

            const body = this.rigidBody;
            const velocity = body.linearVelocity;
            const speedSqr = velocity.x * velocity.x + velocity.y * velocity.y;
            const minSpeedSqr = GameConfig.BallSpeed.minSpeed * GameConfig.BallSpeed.minSpeed;

            if (speedSqr < minSpeedSqr) {
                // 等比缩放速度向量，使其大小等于重置速度
                body.linearVelocity = new Vec2(GameConfig.BallSpeed.resetSpeed, GameConfig.BallSpeed.resetSpeed);
            }
        }
    }

    setSpriteFrame() {
        // 读取 resources 包下目标目录的 SpriteFrame 资源数组
        const infos = GM.ResMgr.Res.getDirWithPath(`Sprites/ball`, SpriteFrame);
        // 拿到实际图片数量，若获取不到则兜底为 9 避免报错
        const actualCount = infos.length > 0 ? infos.length : 9;

        const random = Math.floor(Math.random() * actualCount);
        const path = `Sprites/ball/${random}`;
        Utils.setSpriteFrame(this.sprite, path);
    }

    protected onDestroy(): void {
        this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        this.collider.off(Contact2DType.END_CONTACT, this.onEndContact, this);
    }

    /**
     * 碰撞开始回调
     * @param contact 碰撞信息
     * @param selfCollider 自身的碰撞器
     * @param otherCollider 碰撞对象的碰撞器
     */
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact): void {
        // console.log(`BlockEntity: ${this.node.name} 碰撞开始 with ${otherCollider.node.name}`);
        const body = selfCollider.node.getComponent(BallEntity).rigidBody;
        if (!this._hasCollider) {
            this._hasCollider = true;
            body.gravityScale = 2;
        }
        if (otherCollider && otherCollider.group === GameConfig.CollisionGroup.Cream) {
            // body.linearVelocity = new Vec2(0, 0);
            // 设置极大的线性阻尼和角阻尼，使小球进入后快速失去速度（数值可根据手感调节，越大停得越快）
            body.linearDamping = 3;
            // body.angularDamping = 10;
            // otherCollider.friction = 2;

            // 立即移除碰撞监听，防止在下沉过程中与其他物体发生二次碰撞
            this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            this.collider.off(Contact2DType.END_CONTACT, this.onEndContact, this);

            Tween.stopAllByTarget(this.node);

            // 延迟 1 秒后播放爆炸特效
            tween(this.node)
                .delay(0.1)
                .call(() => {
                    DataManager.Instance.shootMgr.onBallOver();
                    ObjectPoolManager.Instance.ret(this.node);

                    const effect = UnitFactory.Instance.CreateEffect('BallExplosion');
                    if (effect) effect.worldPosition = this.node.worldPosition;
                })
                .start();
        } else {
            if (otherCollider && otherCollider.group == GameConfig.CollisionGroup.Block) {
                const now = Date.now();
                if (now - BallEntity.lastHitSoundTime > 50) { // 增加 50ms 冷却，防止多球并发碰撞引发移动端静音或卡顿
                    GM.CacheMgr.get('isEffectOpen', true) && GM.AudioMgr.playOneShot(GM.AudioMgr.AudioData.BALLCOLLIDER, 0.5);
                    BallEntity.lastHitSoundTime = now;
                    if (GM.CacheMgr.get('isShakeOpen', true)) {
                        // 添加手机短促震动（兼容 H5 及微信小游戏平台）
                        try {
                            const wxObj = (globalThis as any).wx || (window as any).wx;
                            if (wxObj && wxObj.vibrateShort) {
                                wxObj.vibrateShort({ type: 'light' }); // 微信小游戏震动强度可选：'light'（轻）、'medium'（中）、'heavy'（重）
                            } else if (typeof navigator !== 'undefined' && navigator.vibrate) {
                                navigator.vibrate(30); // H5 无法直接控制幅度，只能通过增加震动时长（如改成 30 或 50 毫秒）来让玩家感觉“震得更重”
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    }
                }
            }
            // if (body) {
            //     const velocity = body.linearVelocity;
            //     const speed = velocity.length();

            //     // 只要小球在运动中（避免将静止的小球启动）
            //     if (speed > 0) {
            //         // 如果速度低于配置的最小速度
            //         if (speed < GameConfig.BallSpeed.minSpeed) {
            //             // 等比缩放速度向量，使其大小等于最小速度
            //             velocity.multiplyScalar(GameConfig.BallSpeed.minSpeed / speed);
            //             body.linearVelocity = velocity;
            //         } else if (speed > GameConfig.BallSpeed.maxSpeed) {
            //             // （可选）限制最大速度，防止穿透
            //             velocity.multiplyScalar(GameConfig.BallSpeed.maxSpeed / speed);
            //             body.linearVelocity = velocity;
            //         }
            //     }
            // }
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
}
