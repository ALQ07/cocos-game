System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, instantiate, Node, Singleton, DataManager, GM, ObjectPoolManager, _crd;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  function _reportPossibleCrUseOfSingleton(extras) {
    _reporterNs.report("Singleton", "../Base/Singleton", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDataManager(extras) {
    _reporterNs.report("DataManager", "./DataManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGM(extras) {
    _reporterNs.report("GM", "../../GM/GM", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEntityTypeEnum(extras) {
    _reporterNs.report("EntityTypeEnum", "../Enum", _context.meta, extras);
  }

  _export("ObjectPoolManager", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      instantiate = _cc.instantiate;
      Node = _cc.Node;
    }, function (_unresolved_2) {
      Singleton = _unresolved_2.default;
    }, function (_unresolved_3) {
      DataManager = _unresolved_3.DataManager;
    }, function (_unresolved_4) {
      GM = _unresolved_4.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "6ea47uin95MLZe2Olp1awBQ", "ObjectPoolManager", undefined);

      __checkObsolete__(['instantiate', 'Node', 'Prefab']);

      _export("ObjectPoolManager", ObjectPoolManager = class ObjectPoolManager extends (_crd && Singleton === void 0 ? (_reportPossibleCrUseOfSingleton({
        error: Error()
      }), Singleton) : Singleton) {
        constructor() {
          super(...arguments);
          this.objectPool = null;
          this.map = new Map();
        }

        static get Instance() {
          return super.GetInstance();
        }

        init() {
          var _this = this;

          return _asyncToGenerator(function* () {
            if (!_this.objectPool) {
              _this.objectPool = new Node("ObjectPool");
              _this.objectPool.parent = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
                error: Error()
              }), DataManager) : DataManager).Instance.stage;
            }

            try {
              yield Promise.all([(_crd && GM === void 0 ? (_reportPossibleCrUseOfGM({
                error: Error()
              }), GM) : GM).ResMgr.asyncLoadDir('Prefabs/entity/ball', () => {}), (_crd && GM === void 0 ? (_reportPossibleCrUseOfGM({
                error: Error()
              }), GM) : GM).ResMgr.asyncLoadDir('Prefabs/entity/block', () => {})]);
            } catch (error) {
              console.error('预制体资源加载失败:', error);
            }
          })();
        }

        get(type, name) {
          if (!this.objectPool) console.error('ObjectPool未成功初始化');

          if (!this.map.has(type)) {
            this.map.set(type, []);
            var container = new Node(type + 'Pool');
            container.parent = this.objectPool;
          }

          var nodes = this.map.get(type);

          if (name && nodes.findIndex(i => i.name == name) === -1) {
            var path = "Prefabs/entity/" + type + "/" + name;
            var prefab = (_crd && GM === void 0 ? (_reportPossibleCrUseOfGM({
              error: Error()
            }), GM) : GM).ResMgr.Res.get(path);

            if (!prefab) {
              console.error("Prefab \u52A0\u8F7D\u5931\u8D25: " + path + ", name: " + name);
              return null;
            }

            var parent = this.objectPool.getChildByName(type + 'Pool');
            var node = instantiate(prefab);
            node.name = name;
            node.parent = parent;
            node.active = true;

            if (parent.getChildByName('name')) {
              var nodeIndex = parent.getChildByName('name').getSiblingIndex();
              node.setSiblingIndex(nodeIndex);
            }

            return node;
          } else if (!nodes.length) {
            var _path = "Prefabs/entity/" + type + "/" + type;

            var _prefab = (_crd && GM === void 0 ? (_reportPossibleCrUseOfGM({
              error: Error()
            }), GM) : GM).ResMgr.Res.get(_path);

            if (!_prefab) {
              console.error("Prefab \u52A0\u8F7D\u5931\u8D25: " + _path + ", type: " + type);
              return null;
            }

            var _node = instantiate(_prefab);

            _node.name = type;
            _node.parent = this.objectPool.getChildByName(type + 'Pool');
            _node.active = true;
            return _node;
          } else {
            var _node2 = name ? nodes.pop() : nodes.splice(nodes.findIndex(i => i.name == name), 1)[0];

            _node2.active = true;
            return _node2;
          }
        }

        ret(node) {
          node.active = false; // node.parent = null;

          this.map.get(node.name).push(node);
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=d6d3993a65ac4b7d4cec341ef0d8206ff9e46ac2.js.map