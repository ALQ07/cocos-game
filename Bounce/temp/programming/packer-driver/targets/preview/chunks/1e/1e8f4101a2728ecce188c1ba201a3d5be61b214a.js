System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, ObjectPoolManager, ShootMgr, GameMgr, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _class3, _crd, ccclass, property, DataManager;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfObjectPoolManager(extras) {
    _reporterNs.report("ObjectPoolManager", "./ObjectPoolManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfShootMgr(extras) {
    _reporterNs.report("ShootMgr", "../Stage/ShootMgr", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGameMgr(extras) {
    _reporterNs.report("GameMgr", "../Stage/GameMgr", _context.meta, extras);
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
    }, function (_unresolved_4) {
      GameMgr = _unresolved_4.GameMgr;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "143bc220MNPCLdcbF9lGMfo", "DataManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("DataManager", DataManager = (_dec = ccclass('DataManager'), _dec2 = property(Node), _dec3 = property(_crd && ShootMgr === void 0 ? (_reportPossibleCrUseOfShootMgr({
        error: Error()
      }), ShootMgr) : ShootMgr), _dec4 = property(_crd && GameMgr === void 0 ? (_reportPossibleCrUseOfGameMgr({
        error: Error()
      }), GameMgr) : GameMgr), _dec(_class = (_class2 = (_class3 = class DataManager extends Component {
        constructor() {
          super(...arguments);
          this._curBallNum = 5;
          this._curMaxRows = 0;
          this.blockRankList = new Map();

          _initializerDefineProperty(this, "stage", _descriptor, this);

          _initializerDefineProperty(this, "shootMgr", _descriptor2, this);

          _initializerDefineProperty(this, "gameMgr", _descriptor3, this);
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
          var _this = this;

          return _asyncToGenerator(function* () {
            yield (_crd && ObjectPoolManager === void 0 ? (_reportPossibleCrUseOfObjectPoolManager({
              error: Error()
            }), ObjectPoolManager) : ObjectPoolManager).Instance.init();

            _this.gameMgr.init();
          })();
        }

        get shootDirPos() {
          return this.shootMgr.dir;
        }
        /**弹球场景底部边界 */


        get stageBottomWorldPos() {
          return this.stage.getChildByPath('WallCollider/bottom').worldPosition;
        }
        /**弹球场景左边界 */


        get stageLeftWorldPos() {
          return this.stage.getChildByPath('WallCollider/left').worldPosition;
        }
        /**弹球场景右边界 */


        get stageRightWorldPos() {
          return this.stage.getChildByPath('WallCollider/right').worldPosition;
        }
        /**当前拥有的球的总数 */


        get curBallNum() {
          return this._curBallNum;
        }

        set curBallNum(value) {
          this.curBallNum = value;
        }
        /**当前块的最大行数 */


        get curMaxRows() {
          return this._curMaxRows;
        }

        set curMaxRows(value) {
          this._curMaxRows = value;
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
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "gameMgr", [_dec4], {
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