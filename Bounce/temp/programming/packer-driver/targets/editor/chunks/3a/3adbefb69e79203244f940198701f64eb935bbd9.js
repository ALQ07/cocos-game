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
          const perWidth = width / 6;

          for (let i = 0; i < 5; i++) {
            const block = await (_crd && UnitFactory === void 0 ? (_reportPossibleCrUseOfUnitFactory({
              error: Error()
            }), UnitFactory) : UnitFactory).Instance.CreateBlock({});
            block.setWorldPosition((_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.stageLeftWorldPos.x + (i + 1) * perWidth, (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.stageBottomWorldPos.y, (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.stageLeftWorldPos.z);
          }
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=3adbefb69e79203244f940198701f64eb935bbd9.js.map