System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, ObjectPoolManager, ShootMgr, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _class3, _crd, ccclass, property, DataManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfObjectPoolManager(extras) {
    _reporterNs.report("ObjectPoolManager", "./ObjectPoolManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfShootMgr(extras) {
    _reporterNs.report("ShootMgr", "../Stage/ShootMgr", _context.meta, extras);
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
      Node = _cc.Node;
    }, function (_unresolved_2) {
      ObjectPoolManager = _unresolved_2.ObjectPoolManager;
    }, function (_unresolved_3) {
      ShootMgr = _unresolved_3.ShootMgr;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "9e763szq2tB75GY8oI8vViG", "DataManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("DataManager", DataManager = (_dec = ccclass('DataManager'), _dec2 = property(Node), _dec3 = property(_crd && ShootMgr === void 0 ? (_reportPossibleCrUseOfShootMgr({
        error: Error()
      }), ShootMgr) : ShootMgr), _dec(_class = (_class2 = (_class3 = class DataManager extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "stage", _descriptor, this);

          _initializerDefineProperty(this, "shootMgr", _descriptor2, this);
        }

        static get Instance() {
          return DataManager._instance;
        }

        onLoad() {
          DataManager._instance = this;
        }

        start() {
          this.init();
        }

        init() {
          (_crd && ObjectPoolManager === void 0 ? (_reportPossibleCrUseOfObjectPoolManager({
            error: Error()
          }), ObjectPoolManager) : ObjectPoolManager).Instance.init();
        }

        get shootDirPos() {
          return this.shootMgr.dir;
        }

      }, _class3._instance = null, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "stage", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "shootMgr", [_dec3], {
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
//# sourceMappingURL=1e8f4101a2728ecce188c1ba201a3d5be61b214a.js.map