import { _decorator, Component, Node } from 'cc';
import { DataManager, blockRankInfo } from '../Golbal/DataManager';
import { UnitFactory } from '../Entity/UnitFactory';
import GameConfig from '../Golbal/GameConfig';
const { ccclass, property } = _decorator;

@ccclass('GameMgr')
export class GameMgr extends Component {

    /** 块向上移动的距离 */
    private static readonly MOVE_DISTANCE = 120;

    protected onLoad(): void {

    }

    init() {
        this.generateBlocks();
    }

    /**
     * 生成新的块排
     * 如果blockRankList有块，则先将所有块向上移动，然后生成新块到底部
     * 如果blockRankList没有块，则直接生成新块到底部
     * 当行数超过VERTICAL_BLOCK_ROWS时，游戏结束
     */
    generateBlocks() {
        const blockRankList = DataManager.Instance.blockRankList;

        // 如果已有块，先向上移动所有块
        if (blockRankList.size > 0) {
            this.moveBlocksUp();

            // 检查是否超过最大行数限制
            const maxRowIndex = Math.max(...blockRankList.keys());
            if (maxRowIndex >= GameConfig.VERTICAL_BLOCK_ROWS) {
                this.onGameOver();
                return;
            }
        }

        // 在底部生成新的一排块（rowIndex = 0）
        const newRowBlocks = this.createNewRow(0);
        blockRankList.set(0, newRowBlocks);

        // 更新当前最大行数
        DataManager.Instance.curMaxRows = blockRankList.size;
    }

    /**
     * 将所有块向上移动一段距离
     */
    private moveBlocksUp(): void {
        const blockRankList = DataManager.Instance.blockRankList;
        const newRankList: Map<number, blockRankInfo> = new Map();

        // 遍历所有排，将每排的块向上移动
        blockRankList.forEach((rankInfo, rowIndex) => {
            const newRowIndex = rowIndex + 1;

            // 移动该排所有块的位置
            rankInfo.blocks.forEach(blockNode => {
                const currentPos = blockNode.worldPosition.clone();
                currentPos.y += GameMgr.MOVE_DISTANCE;
                blockNode.setWorldPosition(currentPos);
            });

            // 更新排索引信息
            newRankList.set(newRowIndex, {
                blocks: rankInfo.blocks,
                rowIndex: newRowIndex
            });
        });

        // 清空原列表并更新
        DataManager.Instance.blockRankList.clear();
        newRankList.forEach((value, key) => {
            DataManager.Instance.blockRankList.set(key, value);
        });
    }

    /**
     * 在指定排位置创建新的一排块
     * @param rowIndex 排索引
     */
    private createNewRow(rowIndex: number): blockRankInfo {
        const width = DataManager.Instance.stageRightWorldPos.x - DataManager.Instance.stageLeftWorldPos.x;
        const minX = DataManager.Instance.stageLeftWorldPos.x;
        const baseY = DataManager.Instance.stageBottomWorldPos.y + rowIndex * GameMgr.MOVE_DISTANCE;
        const baseZ = DataManager.Instance.stageLeftWorldPos.z;

        // 随机生成1~6个块
        const blockCount = Math.floor(Math.random() * 6) + 1;

        // 块的宽度
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
        const blocks: Node[] = [];
        for (let i = 0; i < actualCount; i++) {
            const block = UnitFactory.Instance.CreateBlock({});
            block.setWorldPosition(positions[i], baseY, baseZ);
            blocks.push(block);
        }

        return {
            blocks: blocks,
            rowIndex: rowIndex
        };
    }

    /**
     * 游戏结束处理
     */
    private onGameOver(): void {
        console.log("游戏结束！块已堆叠超过最大行数限制。");
        // TODO: 可以在这里触发游戏结束界面或其他处理逻辑
    }
}


