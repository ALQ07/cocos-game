System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, DataManager, UnitFactory, GameConfig, _dec, _class, _class2, _crd, ccclass, property, GameMgr;

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Golbal/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfblockRankInfo(extras) {
    _reporterNs.report("blockRankInfo", "../Golbal/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnitFactory(extras) {
    _reporterNs.report("UnitFactory", "../Entity/UnitFactory", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGameConfig(extras) {
    _reporterNs.report("GameConfig", "../Golbal/GameConfig", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
    }, function (_unresolved_2) {
      DataManager = _unresolved_2.DataManager;
    }, function (_unresolved_3) {
      UnitFactory = _unresolved_3.UnitFactory;
    }, function (_unresolved_4) {
      GameConfig = _unresolved_4.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "bd807ZzFpBHuaD1lg14d2V+", "GameMgr", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("GameMgr", GameMgr = (_dec = ccclass('GameMgr'), _dec(_class = (_class2 = class GameMgr extends Component {
        onLoad() {}

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
          const blockRankList = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.blockRankList; // 如果已有块，先向上移动所有块

          if (blockRankList.size > 0) {
            this.moveBlocksUp(); // 检查是否超过最大行数限制

            const maxRowIndex = Math.max(...blockRankList.keys());

            if (maxRowIndex >= (_crd && GameConfig === void 0 ? (_reportPossibleCrUseOfGameConfig({
              error: Error()
            }), GameConfig) : GameConfig).VERTICAL_BLOCK_ROWS) {
              this.onGameOver();
              return;
            }
          } // 在底部生成新的一排块（rowIndex = 0）


          const newRowBlocks = this.createNewRow(0);
          blockRankList.set(0, newRowBlocks); // 更新当前最大行数

          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.curMaxRows = blockRankList.size;
        }
        /**
         * 将所有块向上移动一段距离
         */


        moveBlocksUp() {
          const blockRankList = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.blockRankList;
          const newRankList = new Map(); // 遍历所有排，将每排的块向上移动

          blockRankList.forEach((rankInfo, rowIndex) => {
            const newRowIndex = rowIndex + 1; // 移动该排所有块的位置

            rankInfo.blocks.forEach(blockNode => {
              const currentPos = blockNode.worldPosition.clone();
              currentPos.y += GameMgr.MOVE_DISTANCE;
              blockNode.setWorldPosition(currentPos);
            }); // 更新排索引信息

            newRankList.set(newRowIndex, {
              blocks: rankInfo.blocks,
              rowIndex: newRowIndex
            });
          }); // 清空原列表并更新

          (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.blockRankList.clear();
          newRankList.forEach((value, key) => {
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.blockRankList.set(key, value);
          });
        }
        /**
         * 在指定排位置创建新的一排块
         * @param rowIndex 排索引
         */


        createNewRow(rowIndex) {
          const width = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.stageRightWorldPos.x - (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.stageLeftWorldPos.x;
          const minX = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.stageLeftWorldPos.x;
          const baseY = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.stageBottomWorldPos.y + rowIndex * GameMgr.MOVE_DISTANCE;
          const baseZ = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.stageLeftWorldPos.z; // 随机生成1~6个块

          const blockCount = Math.floor(Math.random() * 6) + 1; // 块的宽度

          const blockWidth = 100; // 块之间的最小间距

          const minGap = 20; // 最小可放置位置到边界距离

          const margin = blockWidth / 2 + minGap; // 计算有效放置范围

          const effectiveWidth = width - margin * 2; // 每个块占据的最小宽度

          const perBlockSpace = blockWidth + minGap; // 最大可放置块数

          const maxBlocks = Math.floor(effectiveWidth / perBlockSpace) + 1; // 实际可放置块数为 blockCount 和 maxBlocks 的较小值

          const actualCount = Math.min(blockCount, maxBlocks); // 预先随机生成所有块的x坐标位置（确保不重叠）

          const positions = [];
          const step = effectiveWidth / actualCount;

          for (let i = 0; i < actualCount; i++) {
            // 每个块在step范围内随机偏移
            const basePos = minX + margin + i * step;
            const randomOffset = Math.random() * (step - perBlockSpace);
            positions.push(basePos + randomOffset + blockWidth / 2);
          } // 创建所有块


          const blocks = [];

          for (let i = 0; i < actualCount; i++) {
            const block = (_crd && UnitFactory === void 0 ? (_reportPossibleCrUseOfUnitFactory({
              error: Error()
            }), UnitFactory) : UnitFactory).Instance.CreateBlock({});
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


        onGameOver() {
          console.log("游戏结束！块已堆叠超过最大行数限制。"); // TODO: 可以在这里触发游戏结束界面或其他处理逻辑
        }

      }, _class2.MOVE_DISTANCE = 120, _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=3adbefb69e79203244f940198701f64eb935bbd9.js.map