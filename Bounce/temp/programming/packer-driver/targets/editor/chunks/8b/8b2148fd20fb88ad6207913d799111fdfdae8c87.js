System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Input, Node, v3, Vec3, UnitFactory, DataManager, Utils, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, ShootMgr;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfUnitFactory(extras) {
    _reporterNs.report("UnitFactory", "../Entity/UnitFactory", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "../Golbal/DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUtils(extras) {
    _reporterNs.report("Utils", "../Utils", _context.meta, extras);
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
      Input = _cc.Input;
      Node = _cc.Node;
      v3 = _cc.v3;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      UnitFactory = _unresolved_2.UnitFactory;
    }, function (_unresolved_3) {
      DataManager = _unresolved_3.DataManager;
    }, function (_unresolved_4) {
      Utils = _unresolved_4.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "36d2bjmiFpJcLZEyk0lpIkE", "ShootMgr", undefined);

      __checkObsolete__(['_decorator', 'Component', 'EventTouch', 'Input', 'input', 'Node', 'v3', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("ShootMgr", ShootMgr = (_dec = ccclass('ShootMgr'), _dec2 = property(Node), _dec(_class = (_class2 = class ShootMgr extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "shootPoint", _descriptor, this);

          this.isShooting = false;
          this._dir = new Vec3();
        }

        get dir() {
          return this._dir;
        }

        onLoad() {
          this.node.parent.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
          this.node.parent.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
          this.node.parent.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
          this.node.parent.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        }

        onTouchEnd(event) {
          this.shoot();
        }

        onTouchStart(event) {
          this.calculateAngle(event);
        }

        onTouchMove(event) {
          this.calculateAngle(event);
        }

        calculateAngle(event) {
          const uiLocation = event.getUILocation();
          const originPos = this.node.worldPosition;
          const dx = uiLocation.x - originPos.x;
          const dy = uiLocation.y - originPos.y;
          const radians = Math.atan2(dx, -dy);
          const angle = radians * 180 / Math.PI;
          if (Math.abs(angle) > 80) return;
          this.node.angle = angle;
          this._dir = (_crd && Utils === void 0 ? (_reportPossibleCrUseOfUtils({
            error: Error()
          }), Utils) : Utils).getUnitVector(originPos, v3(uiLocation.x, uiLocation.y, 0));
        }

        async shoot() {
          if (this.isShooting) return;
          this.isShooting = true;
          const {
            curBallNum
          } = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
            error: Error()
          }), DataManager) : DataManager).Instance;

          for (let i = 0; i < curBallNum; i++) {
            const ball = (_crd && UnitFactory === void 0 ? (_reportPossibleCrUseOfUnitFactory({
              error: Error()
            }), UnitFactory) : UnitFactory).Instance.CreateBall({
              speed: 50,
              dirPos: this._dir
            });
            ball.worldPosition = this.shootPoint.worldPosition;
            await (_crd && Utils === void 0 ? (_reportPossibleCrUseOfUtils({
              error: Error()
            }), Utils) : Utils).delay(0.2);
          }
        }

        update(deltaTime) {}

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "shootPoint", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=8b2148fd20fb88ad6207913d799111fdfdae8c87.js.map