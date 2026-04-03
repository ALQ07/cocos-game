import Singleton from "../Base/Singleton";
import { BlockShape, EntityTypeEnum } from "../Enum";
import { ObjectPoolManager } from "../Golbal/ObjectPoolManager";
import { BallEntity, BallParams } from "./Ball/BallEntity";
import { BlockEntity, BlockParams } from "./Block/BlockEntity";
import { EffectEntity } from "./Effect/EffectEntity";

export class UnitFactory extends Singleton {
    public static get Instance() {
        return super.GetInstance<UnitFactory>();
    }

    public CreateBall(params: BallParams) {
        const ball = ObjectPoolManager.Instance.get(EntityTypeEnum.Ball);
        const ballComp = ball.getComponent(BallEntity) || ball.addComponent(BallEntity);
        ballComp.init(params);
        return ball;
    }

    public CreateBlock(params: BlockParams) {
        const block = ObjectPoolManager.Instance.get(EntityTypeEnum.Block, params.shape);
        const blocklComp = block.getComponent(BlockEntity) || block.addComponent(BlockEntity);
        blocklComp.init(params);
        return block;
    }

    public CreateEffect(name: string) {
        const effect = ObjectPoolManager.Instance.get(EntityTypeEnum.Effect, name);
        const effectComp = effect.getComponent(EffectEntity) || effect.addComponent(EffectEntity);
        return effect;
    }
}