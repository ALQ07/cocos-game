import Singleton from "../Base/Singleton";
import { EntityTypeEnum } from "../Enum";
import { ObjectPoolManager } from "../Golbal/ObjectPoolManager";
import { BallEntity, BallParams } from "./Ball/BallEntity";
import { BlockEntity, BlockParams } from "./Block/BlockEntity";

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
        const block = ObjectPoolManager.Instance.get(EntityTypeEnum.Block);
        const blocklComp = block.getComponent(BlockEntity) || block.addComponent(BlockEntity);
        blocklComp.init(params);
        return block;
    }
}