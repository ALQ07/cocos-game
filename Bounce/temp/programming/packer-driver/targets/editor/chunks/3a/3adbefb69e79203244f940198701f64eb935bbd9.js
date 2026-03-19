System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, DataManager, UnitFactory, _dec, _class, _crd, ccclass, property, GameMgr;

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Golbal/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnitFactory(extras) {
    _reporterNs.report("UnitFactory", "../Entity/UnitFactory", _context.meta, extras);
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
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "bd807ZzFpBHuaD1lg14d2V+", "GameMgr", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("GameMgr", GameMgr = (_dec = ccclass('GameMgr'), _dec(_class = class GameMgr extends Component {
        onLoad() {}

        init() {
          this.generateBlocks();
        }

        async generateBlocks() {
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
          }), DataManager) : DataManager).Instance.stageBottomWorldPos.y;
          const baseZ = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.stageLeftWorldPos.z; // 随机生成1~6个块

          const blockCount = Math.floor(Math.random() * 6) + 1; // 块的宽度（假设方块宽度为50，可根据实际调整）

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


          for (let i = 0; i < actualCount; i++) {
            const block = await (_crd && UnitFactory === void 0 ? (_reportPossibleCrUseOfUnitFactory({
              error: Error()
            }), UnitFactory) : UnitFactory).Instance.CreateBlock({});
            block.setWorldPosition(positions[i], baseY, baseZ);
          }
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=3adbefb69e79203244f940198701f64eb935bbd9.js.map