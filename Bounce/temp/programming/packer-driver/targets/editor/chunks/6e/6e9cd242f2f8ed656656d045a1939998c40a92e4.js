System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, Singleton, EntityTypeEnum, ObjectPoolManager, BallEntity, UnitFactory, _crd;

  function _reportPossibleCrUseOfSingleton(extras) {
    _reporterNs.report("Singleton", "../../Base/Singleton", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEntityTypeEnum(extras) {
    _reporterNs.report("EntityTypeEnum", "../../Enum", _context.meta, extras);
  }

  function _reportPossibleCrUseOfObjectPoolManager(extras) {
    _reporterNs.report("ObjectPoolManager", "../../Golbal/ObjectPoolManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBallEntity(extras) {
    _reporterNs.report("BallEntity", "./BallEntity", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBallParams(extras) {
    _reporterNs.report("BallParams", "./BallEntity", _context.meta, extras);
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
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "2471bCTu4tA8KWMQlLwHJga", "UnitFactory", undefined);

      _export("UnitFactory", UnitFactory = class UnitFactory extends (_crd && Singleton === void 0 ? (_reportPossibleCrUseOfSingleton({
        error: Error()
      }), Singleton) : Singleton) {
        static get Instance() {
          return super.GetInstance();
        }

        async CreateBall(params) {
          const ball = await (_crd && ObjectPoolManager === void 0 ? (_reportPossibleCrUseOfObjectPoolManager({
            error: Error()
          }), ObjectPoolManager) : ObjectPoolManager).Instance.get((_crd && EntityTypeEnum === void 0 ? (_reportPossibleCrUseOfEntityTypeEnum({
            error: Error()
          }), EntityTypeEnum) : EntityTypeEnum).Ball);
          const ballComp = ball.addComponent(_crd && BallEntity === void 0 ? (_reportPossibleCrUseOfBallEntity({
            error: Error()
          }), BallEntity) : BallEntity);
          ballComp.init(params);
          return ball;
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=6e9cd242f2f8ed656656d045a1939998c40a92e4.js.map