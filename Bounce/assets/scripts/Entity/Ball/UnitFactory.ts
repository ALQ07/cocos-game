import Singleton from "../../Base/Singleton";
import { EntityTypeEnum } from "../../Enum";
import { ObjectPoolManager } from "../../Golbal/ObjectPoolManager";
import { BallEntity, BallParams } from "./BallEntity";

export class UnitFactory extends Singleton {
    public static get Instance() {
        return super.GetInstance<UnitFactory>();
    }

    public async CreateBall(params: BallParams) {
        const ball = await ObjectPoolManager.Instance.get(EntityTypeEnum.Ball);
        const ballComp = ball.addComponent(BallEntity);
        ballComp.init(params);
        return ball;
    }
}