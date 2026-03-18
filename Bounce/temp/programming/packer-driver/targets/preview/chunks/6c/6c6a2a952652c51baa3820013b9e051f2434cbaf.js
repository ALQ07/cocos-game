System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, RigidBody2D, Entity, BlockEntity, _crd;

  function _reportPossibleCrUseOfEntity(extras) {
    _reporterNs.report("Entity", "../../Base/Entity", _context.meta, extras);
  }

  _export("BlockEntity", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      RigidBody2D = _cc.RigidBody2D;
    }, function (_unresolved_2) {
      Entity = _unresolved_2.Entity;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "02b6cEciU9Dyb4H77LGbxgQ", "BlockEntity", undefined);

      __checkObsolete__(['RigidBody2D', 'Vec2', 'Vec3']);

      _export("BlockEntity", BlockEntity = class BlockEntity extends (_crd && Entity === void 0 ? (_reportPossibleCrUseOfEntity({
        error: Error()
      }), Entity) : Entity) {
        constructor() {
          super(...arguments);
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

        init(params) {// this._speed = params.speed;
          // this._dirPos = params.dirPos
        }

        update(dt) {// const currentPos = this.node.position.clone();
          // const delta = this._dirPos.clone().multiplyScalar(this._speed * dt);
          // this.node.position = currentPos.add(delta);
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=6c6a2a952652c51baa3820013b9e051f2434cbaf.js.map