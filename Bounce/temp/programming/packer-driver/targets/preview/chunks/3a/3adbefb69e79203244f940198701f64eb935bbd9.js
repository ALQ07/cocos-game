System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, DataManager, UnitFactory, _dec, _class, _crd, ccclass, property, GameMgr;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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

        generateBlocks() {
          return _asyncToGenerator(function* () {
            var width = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.stageRightWorldPos.x - (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.stageLeftWorldPos.x;
            var perWidth = width / 6;

            for (var i = 0; i < 5; i++) {
              var block = yield (_crd && UnitFactory === void 0 ? (_reportPossibleCrUseOfUnitFactory({
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
          })();
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=3adbefb69e79203244f940198701f64eb935bbd9.js.map