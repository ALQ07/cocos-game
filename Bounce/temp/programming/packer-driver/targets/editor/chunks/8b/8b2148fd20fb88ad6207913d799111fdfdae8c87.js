System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Input, input, v3, Vec3, getUnitVector, _dec, _class, _crd, ccclass, property, ShootMgr;

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

      _export("ShootMgr", ShootMgr = (_dec = ccclass('ShootMgr'), _dec(_class = class ShootMgr extends Component {
        constructor(...args) {
          super(...args);
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
          const uiLocation = event.getUILocation();
          const originPos = this.node.worldPosition;
          const dx = uiLocation.x - originPos.x;
          const dy = uiLocation.y - originPos.y;
          const radians = Math.atan2(dx, -dy);
          const angle = radians * 180 / Math.PI;
          if (Math.abs(angle) > 80) return;
          this.node.angle = angle;
          this._dir = (_crd && getUnitVector === void 0 ? (_reportPossibleCrUseOfgetUnitVector({
            error: Error()
          }), getUnitVector) : getUnitVector)(originPos, v3(uiLocation.x, uiLocation.y, 0));
        }

        shoot() {}

        update(deltaTime) {}

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=8b2148fd20fb88ad6207913d799111fdfdae8c87.js.map