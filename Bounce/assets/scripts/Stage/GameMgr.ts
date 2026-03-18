import { _decorator, Component, Node } from 'cc';
import { DataManager } from '../Golbal/DataManager';
import { UnitFactory } from '../Entity/UnitFactory';
const { ccclass, property } = _decorator;

@ccclass('GameMgr')
export class GameMgr extends Component {
    protected onLoad(): void {

    }

    init() {
        this.generateBlocks();
    }

    async generateBlocks() {
        const width = DataManager.Instance.stageRightWorldPos.x - DataManager.Instance.stageLeftWorldPos.x;
        const perWidth = width / 6;
        for (let i = 0; i < 5; i++) {
            const block = await UnitFactory.Instance.CreateBlock({});
            block.setWorldPosition(DataManager.Instance.stageLeftWorldPos.x + (i + 1) * perWidth, DataManager.Instance.stageBottomWorldPos.y, DataManager.Instance.stageLeftWorldPos.z);
        }
    }
}


