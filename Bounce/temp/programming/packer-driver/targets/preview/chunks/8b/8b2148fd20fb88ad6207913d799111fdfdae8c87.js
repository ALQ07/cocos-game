System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Input, input, Node, v3, Vec3, getUnitVector, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, ShootMgr;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfgetUnitVector(extras) {
    _reporterNs.report("getUnitVector", "../Utils", _context.meta, extras);
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
      input = _cc.input;
      Node = _cc.Node;
      v3 = _cc.v3;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      getUnitVector = _unresolved_2.getUnitVector;
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
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "launcher", _descriptor, this);

          this._dir = new Vec3();
        }

        get dir() {
          return this._dir;
        }

        onLoad() {
          input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
          input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
          input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
          input.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
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
          var uiLocation = event.getUILocation();
          var originPos = this.launcher.worldPosition;
          var dx = uiLocation.x - originPos.x;
          var dy = uiLocation.y - originPos.y;
          var radians = Math.atan2(dx, -dy);
          var angle = radians * 180 / Math.PI;
          if (Math.abs(angle) > 80) return;
          this.launcher.angle = angle;
          this._dir = (_crd && getUnitVector === void 0 ? (_reportPossibleCrUseOfgetUnitVector({
            error: Error()
          }), getUnitVector) : getUnitVector)(originPos, v3(uiLocation.x, uiLocation.y, 0));
        }

        shoot() {}

        update(deltaTime) {}

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "launcher", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=8b2148fd20fb88ad6207913d799111fdfdae8c87.js.map