import { _decorator, Component, director, Node, PhysicsSystem, PhysicsSystem2D } from 'cc';
import { DataManager, blockRankInfo } from '../Golbal/DataManager';
import { UnitFactory } from '../Entity/UnitFactory';
import GameConfig from '../Golbal/GameConfig';
import GM from '../../GM/GM';
import { BlockShape } from '../Enum';
import { BlockEntity } from '../Entity/Block/BlockEntity';
import Utils from '../Utils';
import { UIEnum } from '../../GM/UIMgr/UIList';
import { ObjectPoolManager } from '../Golbal/ObjectPoolManager';
import { UIGameoverArg } from '../Modules/UIGameover/UIGameover';
const { ccclass, property } = _decorator;

interface CachedBlock {
    x: number;
    y: number;
    z: number;
    shape: BlockShape;
    hp: number;
}

interface CachedRank {
    rowIndex: number;
    blocks: CachedBlock[];
}

@ccclass('GameMgr')
export class GameMgr extends Component {

    /** 块向上移动的距离 */
    private static readonly MOVE_DISTANCE = 140;

    public static _instance: GameMgr = null;

    public static get Instance() {
        return GameMgr._instance;
    }

    protected onLoad(): void {
        GameMgr._instance = this;
    }

    init() {
        const cachedData = GM.CacheMgr.get<CachedRank[]>('blockRankList');
        if (cachedData && cachedData.length > 0) {
            this.restoreFromCache(cachedData);
        } else {
            this.generateBlocks();
        }
    }

    /**
     * 生成新的块排。
     * 如果是新游戏（即 `blockRankList` 为空），则将回合数设置为 1。
     * 否则，将回合数递增。
     *
     * 如果blockRankList有块，则先将所有块向上移动，然后生成新块到底部
     * 如果blockRankList没有块，则直接生成新块到底部
     * 当行数超过VERTICAL_BLOCK_ROWS时，游戏结束
     */
    generateBlocks() {
        DataManager.Instance.Round += 1;

        // 如果 blockRankList 为空，说明是新游戏的第一回合
        if (DataManager.Instance.blockRankList.size === 0) {
            DataManager.Instance.Round = 1;
        } else {
            DataManager.Instance.Round += 1;
        }
        const blockRankList = DataManager.Instance.blockRankList;

        // 如果已有块，先向上移动所有块
        if (blockRankList.size > 0) {
            this.moveBlocksUp();

            // 检查是否超过最大行数限制
            // 使用 Array.from 转换为数组后再展开，防止某些环境中报迭代器不可展开的错
            const maxRowIndex = Math.max(...Array.from(blockRankList.keys()));
            if (maxRowIndex >= GameConfig.VERTICAL_BLOCK_ROWS) {
                this.onGameOver();
                return;
            }
        }

        // 在底部生成新的一排块（rowIndex = 0）
        const newRowBlocks = this.createNewRow(0);
        blockRankList.set(0, newRowBlocks);

        // 更新当前最大行数
        DataManager.Instance.curMaxRows = Math.max(...Array.from(blockRankList.keys()));

        // 保存最新状态到缓存
        this.saveToCache();
    }

    /**
     * 从缓存中恢复块的数据
     */
    private restoreFromCache(cachedData: CachedRank[]) {
        const blockRankList = DataManager.Instance.blockRankList;
        blockRankList.clear();

        for (const rankData of cachedData) {
            const blocks: Node[] = [];
            for (const blockData of rankData.blocks) {
                const block = UnitFactory.Instance.CreateBlock({ shape: blockData.shape, hp: blockData.hp });
                block.setWorldPosition(blockData.x, blockData.y, blockData.z);
                blocks.push(block);
            }
            blockRankList.set(rankData.rowIndex, {
                blocks: blocks,
                rowIndex: rankData.rowIndex
            });
        }
        DataManager.Instance.curMaxRows = Math.max(...Array.from(blockRankList.keys()));
    }

    /**
     * 将当前的块排信息保存到缓存中
     */
    public saveToCache() {
        const blockRankList = DataManager.Instance.blockRankList;
        const cacheData: CachedRank[] = [];

        blockRankList.forEach((rankInfo, rowIndex) => {
            const validBlocks = rankInfo.blocks.filter(b => b && b.isValid && b.active);
            if (validBlocks.length > 0) {
                const blocksData = validBlocks.map(b => {
                    const pos = b.worldPosition;
                    return {
                        x: pos.x,
                        y: pos.y,
                        z: pos.z,
                        shape: b.name.split('-')[1] as BlockShape,
                        hp: b.getComponent(BlockEntity).curNum
                    };
                });
                cacheData.push({
                    rowIndex: rowIndex,
                    blocks: blocksData
                });
            }
        });

        GM.CacheMgr.set('blockRankList', cacheData);
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

            // 过滤掉已经被击毁并回收的块 (active 为 false 说明已回收到对象池)
            const validBlocks = rankInfo.blocks.filter(blockNode => blockNode && blockNode.isValid && blockNode.active);

            // 移动该排所有块的位置
            validBlocks.forEach(blockNode => {
                const currentPos = blockNode.worldPosition.clone();
                currentPos.y += GameMgr.MOVE_DISTANCE;
                blockNode.setWorldPosition(currentPos);
            });

            // 如果该排还有存活的块，才更新排索引信息
            if (validBlocks.length > 0) {
                newRankList.set(newRowIndex, {
                    blocks: validBlocks,
                    rowIndex: newRowIndex
                });
            }
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
        const blockWidth = 120;
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

        // 并非每回合都生成道具块，设定一个概率（例如这里设为 40% 的概率生成）
        // 同时确保 actualCount > 1，避免出现这一排只有一个道具块而没有普通阻挡块的情况
        let blindIndex = -1;
        if (actualCount > 1 && Math.random() < 0.4) {
            blindIndex = Math.floor(Math.random() * actualCount);
        }

        const normalShapes = [BlockShape.Triangle, BlockShape.Square];

        for (let i = 0; i < actualCount; i++) {
            let shape: BlockShape;
            let hp: number;

            if (i === blindIndex) {
                shape = BlockShape.Blind;
                hp = 1; // 道具块只需碰一次即生效并销毁
            } else {
                shape = normalShapes[Math.floor(Math.random() * normalShapes.length)];

                // ------ 根据阶段动态计算血量 ------
                const round = DataManager.Instance.Round;
                hp = round;

                if (round > 60) {
                    // 无尽期
                    const rand = Math.random();
                    if (rand < 0.1) hp = Math.ceil(round * 3.0); // 叹息之墙
                    else if (rand < 0.4) hp = Math.ceil(round * (1.5 + Math.random() * 0.5)); // 坚固块
                    else hp = Math.ceil(round * (1.0 + Math.random() * 0.2)); // 普通块
                } else if (round > 30) {
                    // 挑战期
                    const rand = Math.random();
                    if (rand < 0.2) hp = Math.ceil(round * 1.5); // 坚固块
                    else if (rand < 0.3) hp = Math.ceil(round * 0.5); // 脆弱块
                    else hp = Math.ceil(round * (0.8 + Math.random() * 0.4)); // 普通块
                } else if (round > 10) {
                    // 进阶期
                    hp = Math.random() < 0.2 ? Math.ceil(round * 0.5) : Math.ceil(round * (0.8 + Math.random() * 0.4));
                }
                hp = Math.max(1, hp);
            }

            const block = UnitFactory.Instance.CreateBlock({ shape, hp });
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
        // GM.CacheMgr.delete('blockRankList');
        // TODO: 可以在这里触发游戏结束界面或其他处理逻辑
        GM.UIMgr.Open(UIEnum.UIGameover, { isDead: true } as UIGameoverArg);
    }

    /**
     * 清除缓存
     */
    clearCache() {
        // 重置游戏状态
        DataManager.Instance.Score = 0;
        DataManager.Instance.curBallNum = 1; // 重置球的数量
        Utils.setGlobalTimeScale(1.0);
        DataManager.Instance.speedAddBtn.active = true;

        // 在清空数据前，遍历并回收场景中所有现存的块节点
        DataManager.Instance.blockRankList.forEach((rankInfo) => {
            rankInfo.blocks.forEach(block => {
                if (block && block.isValid && block.active) {
                    ObjectPoolManager.Instance.ret(block);
                }
            });
        });

        // 清除DataManager中的块排信息和最大行数
        DataManager.Instance.blockRankList.clear();
        DataManager.Instance.curMaxRows = 0;

        // 清除缓存中的所有游戏状态，确保init时不会加载旧数据
        GM.CacheMgr.delete('blockRankList');
        GM.CacheMgr.delete('score');
        GM.CacheMgr.delete('round');
        GM.CacheMgr.delete('curBallNum');
    }

    /**
     * 重新开始游戏
     */
    restartGame() {
        this.clearCache();
        this.init();
    }

    /**
     * 关闭游戏
     */
    exitGame() {
        ObjectPoolManager.Instance.clear();
        // this.saveToCache();
        DataManager.Instance.blockRankList.forEach((rankInfo) => {
            rankInfo.blocks.forEach(block => {
                if (block && block.isValid && block.active) {
                    ObjectPoolManager.Instance.ret(block);
                }
            });
        });

        DataManager.Instance.blockRankList.clear();
        DataManager.Instance.curMaxRows = 0;

        Utils.setGlobalTimeScale(1.0);
        if (DataManager.Instance.speedAddBtn) {
            DataManager.Instance.speedAddBtn.active = true;
        }
        GM.UIMgr.Close(this.node);
    }

    /**
     * 游戏倍速
     */
    gameSpeedAdd() {
        Utils.setGlobalTimeScale(2.0);
        DataManager.Instance.speedAddBtn.active = false;
    }

    protected onDestroy(): void {
        // this.exitGame();
    }
}
