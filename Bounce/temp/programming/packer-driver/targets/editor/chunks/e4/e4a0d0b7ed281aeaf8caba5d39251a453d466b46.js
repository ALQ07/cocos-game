System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, RigidBody2D, Vec2, Entity, DataManager, ObjectPoolManager, BallEntity, _crd;

  function _reportPossibleCrUseOfEntity(extras) {
    _reporterNs.report("Entity", "../../Base/Entity", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../../Golbal/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfObjectPoolManager(extras) {
    _reporterNs.report("ObjectPoolManager", "../../Golbal/ObjectPoolManager", _context.meta, extras);
  }

  _export("BallEntity", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      RigidBody2D = _cc.RigidBody2D;
      Vec2 = _cc.Vec2;
    }, function (_unresolved_2) {
      Entity = _unresolved_2.Entity;
    }, function (_unresolved_3) {
      DataManager = _unresolved_3.DataManager;
    }, function (_unresolved_4) {
      ObjectPoolManager = _unresolved_4.ObjectPoolManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "edd2dGMn7VBV6FumAw27TZP", "BallEntity", undefined);

      __checkObsolete__(['RigidBody2D', 'Vec2', 'Vec3']);

      _export("BallEntity", BallEntity = class BallEntity extends (_crd && Entity === void 0 ? (_reportPossibleCrUseOfEntity({
        error: Error()
      }), Entity) : Entity) {
        constructor(...args) {
          super(...args);
          this.rigidBody = null;
          this._speed = 0;
          this._dirPos = null;
        }

        set speed(v) {
          this._speed = v;
        }

        get speed() {
          return this._speed;
        }

        get dirPos() {
          return this._dirPos;
        }

        set dirPos(value) {
          this._dirPos = value;
        }

        onLoad() {
          this.rigidBody = this.node.getComponent(RigidBody2D);
        }

        init(params) {
          this._speed = params.speed;
          this._dirPos = params.dirPos;

          const delta = this._dirPos.clone().multiplyScalar(this._speed);

          this.rigidBody.linearVelocity = new Vec2(delta.x, delta.y);
        }

        update(dt) {
          // const currentPos = this.node.position.clone();
          // const delta = this._dirPos.clone().multiplyScalar(this._speed * dt);
          // this.node.position = currentPos.add(delta);
          // 检测球是否超出底部边界
          const bottomY = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance.stageBottomWorldPos.y;

          if (this.node.worldPosition.y < bottomY) {
            (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.shootMgr.onBallOver();
            (_crd && ObjectPoolManager === void 0 ? (_reportPossibleCrUseOfObjectPoolManager({
              error: Error()
            }), ObjectPoolManager) : ObjectPoolManager).Instance.ret(this.node);
          }
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=e4a0d0b7ed281aeaf8caba5d39251a453d466b46.js.map