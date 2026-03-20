System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Contact2DType, Label, PolygonCollider2D, RigidBody2D, Entity, ObjectPoolManager, BlockEntity, _crd;

  function _reportPossibleCrUseOfEntity(extras) {
    _reporterNs.report("Entity", "../../Base/Entity", _context.meta, extras);
  }

  function _reportPossibleCrUseOfColliderType(extras) {
    _reporterNs.report("ColliderType", "../../Enum", _context.meta, extras);
  }

  function _reportPossibleCrUseOfObjectPoolManager(extras) {
    _reporterNs.report("ObjectPoolManager", "../../Golbal/ObjectPoolManager", _context.meta, extras);
  }

  _export("BlockEntity", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      Contact2DType = _cc.Contact2DType;
      Label = _cc.Label;
      PolygonCollider2D = _cc.PolygonCollider2D;
      RigidBody2D = _cc.RigidBody2D;
    }, function (_unresolved_2) {
      Entity = _unresolved_2.Entity;
    }, function (_unresolved_3) {
      ObjectPoolManager = _unresolved_3.ObjectPoolManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "02b6cEciU9Dyb4H77LGbxgQ", "BlockEntity", undefined);

      __checkObsolete__(['BoxCollider2D', 'CircleCollider2D', 'Contact2DType', 'Label', 'PolygonCollider2D', 'RigidBody2D', 'Vec3']);

      _export("BlockEntity", BlockEntity = class BlockEntity extends (_crd && Entity === void 0 ? (_reportPossibleCrUseOfEntity({
        error: Error()
      }), Entity) : Entity) {
        constructor(...args) {
          super(...args);
          this.rigidBody = null;
          this.collider = void 0;
          this.nLabel = null;
          this._speed = 0;
          this._dirPos = null;
          this._curNum = 0;
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

        get curNum() {
          return this._curNum;
        }

        set curNum(value) {
          this._curNum = value;
          this.nLabel.string = `${value}`;
        }

        onLoad() {
          this.rigidBody = this.node.getComponent(RigidBody2D);
          this.nLabel = this.node.getChildByName('Label').getComponent(Label);
        }

        onDestroy() {
          this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
          this.collider.off(Contact2DType.END_CONTACT, this.onEndContact, this);
        }

        init(params) {
          const angle = Math.random() * 360;

          if (this.node.children.length > 0) {
            const graphic = this.node.children[0];
            graphic.angle = angle;
          } else {
            this.node.angle = angle;
          }

          this.curNum = 50;
          this.nLabel.string = `${this.curNum}`;
          this.collider = this.node.getComponentInChildren(PolygonCollider2D); // 监听碰撞回调

          this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
          this.collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
        /**
         * 碰撞开始回调
         * @param contact 碰撞信息
         * @param selfCollider 自身的碰撞器
         * @param otherCollider 碰撞对象的碰撞器
         */


        onBeginContact(contact, selfCollider, otherCollider) {
          // console.log(`BlockEntity: ${this.node.name} 碰撞开始 with ${otherCollider.node.name}`);
          this.curNum -= 1;

          if (this.curNum <= 0) {
            (_crd && ObjectPoolManager === void 0 ? (_reportPossibleCrUseOfObjectPoolManager({
              error: Error()
            }), ObjectPoolManager) : ObjectPoolManager).Instance.ret(this.node);
          }
        }
        /**
         * 碰撞结束回调
         * @param selfCollider 自身的碰撞器
         * @param otherCollider 碰撞对象的碰撞器
         */


        onEndContact(selfCollider, otherCollider) {// console.log(`BlockEntity: ${this.node.name} 碰撞结束 with ${otherCollider.node.name}`);
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