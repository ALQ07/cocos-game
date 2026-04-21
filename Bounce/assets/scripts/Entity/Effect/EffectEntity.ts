import { _decorator, Component, ParticleSystem2D } from "cc";
import { ObjectPoolManager } from "../../Golbal/ObjectPoolManager";
const { ccclass, property } = _decorator;

@ccclass('EffectEntity')
export class EffectEntity extends Component {
    private particle: ParticleSystem2D = null;

    onEnable() {
        this.particle = this.node.getComponentInChildren(ParticleSystem2D);
        if (this.particle) {
            this.particle.resetSystem(); // 重置并播放粒子
            // 根据粒子生命周期自动计算回收时间
            const duration = this.particle.life + this.particle.lifeVar;
            this.scheduleOnce(this.recycle, duration > 0 ? duration : 1);
        } else {
            // 如果没有挂载粒子组件，默认1秒后回收
            this.scheduleOnce(this.recycle, 1);
        }
    }

    recycle() {
        ObjectPoolManager.Instance.ret(this.node);
    }
}