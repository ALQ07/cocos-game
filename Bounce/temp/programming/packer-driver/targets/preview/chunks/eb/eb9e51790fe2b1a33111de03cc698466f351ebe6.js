System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, Singleton, EntityTypeEnum, ObjectPoolManager, BallEntity, BlockEntity, UnitFactory, _crd;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  function _reportPossibleCrUseOfSingleton(extras) {
    _reporterNs.report("Singleton", "../Base/Singleton", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEntityTypeEnum(extras) {
    _reporterNs.report("EntityTypeEnum", "../Enum", _context.meta, extras);
  }

  function _reportPossibleCrUseOfObjectPoolManager(extras) {
    _reporterNs.report("ObjectPoolManager", "../Golbal/ObjectPoolManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBallEntity(extras) {
    _reporterNs.report("BallEntity", "./Ball/BallEntity", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBallParams(extras) {
    _reporterNs.report("BallParams", "./Ball/BallEntity", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBlockEntity(extras) {
    _reporterNs.report("BlockEntity", "./Block/BlockEntity", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBlockParams(extras) {
    _reporterNs.report("BlockParams", "./Block/BlockEntity", _context.meta, extras);
  }

  _export("UnitFactory", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      Singleton = _unresolved_2.default;
    }, function (_unresolved_3) {
      EntityTypeEnum = _unresolved_3.EntityTypeEnum;
    }, function (_unresolved_4) {
      ObjectPoolManager = _unresolved_4.ObjectPoolManager;
    }, function (_unresolved_5) {
      BallEntity = _unresolved_5.BallEntity;
    }, function (_unresolved_6) {
      BlockEntity = _unresolved_6.BlockEntity;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "8796czSjaVP4JDhGN9ocxCA", "UnitFactory", undefined);

      _export("UnitFactory", UnitFactory = class UnitFactory extends (_crd && Singleton === void 0 ? (_reportPossibleCrUseOfSingleton({
        error: Error()
      }), Singleton) : Singleton) {
        static get Instance() {
          return super.GetInstance();
        }

        CreateBall(params) {
          return _asyncToGenerator(function* () {
            var ball = yield (_crd && ObjectPoolManager === void 0 ? (_reportPossibleCrUseOfObjectPoolManager({
              error: Error()
            }), ObjectPoolManager) : ObjectPoolManager).Instance.get((_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
              error: Error()
            }), EntityTypeEnum) : EntityTypeEnum).Ball);
            var ballComp = ball.getComponent(_crd && BallEntity === void 0 ? (_reportPossibleCrUseOfBallEntity({
              error: Error()
            }), BallEntity) : BallEntity) || ball.addComponent(_crd && BallEntity === void 0 ? (_reportPossibleCrUseOfBallEntity({
              error: Error()
            }), BallEntity) : BallEntity);
            ballComp.init(params);
            return ball;
          })();
        }

        CreateBlock(params) {
          return _asyncToGenerator(function* () {
            var block = yield (_crd && ObjectPoolManager === void 0 ? (_reportPossibleCrUseOfObjectPoolManager({
              error: Error()
            }), ObjectPoolManager) : ObjectPoolManager).Instance.get((_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
              error: Error()
            }), EntityTypeEnum) : EntityTypeEnum).Block);
            var blocklComp = block.getComponent(_crd && BlockEntity === void 0 ? (_reportPossibleCrUseOfBlockEntity({
              error: Error()
            }), BlockEntity) : BlockEntity) || block.addComponent(_crd && BlockEntity === void 0 ? (_reportPossibleCrUseOfBlockEntity({
              error: Error()
            }), BlockEntity) : BlockEntity);
            blocklComp.init(params);
            return block;
          })();
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=eb9e51790fe2b1a33111de03cc698466f351ebe6.js.map