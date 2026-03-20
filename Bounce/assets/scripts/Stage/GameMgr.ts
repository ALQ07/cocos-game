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

    generateBlocks() {
        const width = DataManager.Instance.stageRightWorldPos.x - DataManager.Instance.stageLeftWorldPos.x;
        const minX = DataManager.Instance.stageLeftWorldPos.x;
        const baseY = DataManager.Instance.stageBottomWorldPos.y;
        const baseZ = DataManager.Instance.stageLeftWorldPos.z;

        // 随机生成1~6个块
        const blockCount = Math.floor(Math.random() * 6) + 1;

        // 块的宽度（假设方块宽度为50，可根据实际调整）
        const blockWidth = 100;
        // 块之间的最小间距
        const minGap = 20;
        // 最小可放置位置到边界距离
        const margin = blockWidth / 2 + minGap;

        // 计算有效放置范围
        const effectiveWidth = width - margin * 2;
        // 每个块占据的最小宽度
        const perBlockSpace = blockWidth + minGap;
        // 最大可放置块数
        const maxBlocks = Math.floor(effectiveWidth / perBlockSpace) + 1;
        // 实际可放置块数为 blockCount 和 maxBlocks 的较小值
        const actualCount = Math.min(blockCount, maxBlocks);

        // 预先随机生成所有块的x坐标位置（确保不重叠）
        const positions: number[] = [];
        const step = effectiveWidth / actualCount;

        for (let i = 0; i < actualCount; i++) {
            // 每个块在step范围内随机偏移
            const basePos = minX + margin + i * step;
            const randomOffset = Math.random() * (step - perBlockSpace);
            positions.push(basePos + randomOffset + blockWidth / 2);
        }

        // 创建所有块
        for (let i = 0; i < actualCount; i++) {
            const block = UnitFactory.Instance.CreateBlock({});
            block.setWorldPosition(positions[i], baseY, baseZ);
        }
    }
}


