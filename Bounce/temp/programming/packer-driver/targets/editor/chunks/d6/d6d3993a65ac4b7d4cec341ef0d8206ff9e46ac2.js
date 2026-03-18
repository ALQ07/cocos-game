System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, instantiate, Node, Singleton, DataManager, GM, ObjectPoolManager, _crd;

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
        constructor(...args) {
          super(...args);
          this.objectPool = null;
          this.map = new Map();
        }

        static get Instance() {
          return super.GetInstance();
        }

        init() {
          if (!this.objectPool) {
            this.objectPool = new Node("ObjectPool");
            this.objectPool.parent = (_crd && DataManager === void 0 ? (_reportPossibleCrUseOfDataManager({
              error: Error()
            }), DataManager) : DataManager).Instance.stage;
          }
        }

        async get(type, name) {
          if (!this.objectPool) console.error('ObjectPool未成功初始化');

          if (!this.map.has(type)) {
            this.map.set(type, []);
            const container = new Node(type + 'Pool');
            container.parent = this.objectPool;
          }

          const nodes = this.map.get(type);

          if (name && nodes.findIndex(i => i.name == name) === -1) {
            const path = `Prefabs/entity/${type}/${name}`;
            const prefab = await (_crd && GM === void 0 ? (_reportPossibleCrUseOfGM({
              error: Error()
            }), GM) : GM).ResMgr.asyncLoad(path, () => {});
            const parent = this.objectPool.getChildByName(type + 'Pool');
            const node = instantiate(prefab);
            node.name = name;
            node.parent = parent;
            node.active = true;

            if (parent.getChildByName('name')) {
              const nodeIndex = parent.getChildByName('name').getSiblingIndex();
              node.setSiblingIndex(nodeIndex);
            }

            return node;
          } else if (!nodes.length) {
            const path = `Prefabs/entity/${type}/${type}`;
            const prefab = await (_crd && GM === void 0 ? (_reportPossibleCrUseOfGM({
              error: Error()
            }), GM) : GM).ResMgr.asyncLoad(path, () => {});
            const node = instantiate(prefab);
            node.name = type;
            node.parent = this.objectPool.getChildByName(type + 'Pool');
            node.active = true;
            return node;
          } else {
            const node = name ? nodes.pop() : nodes.splice(nodes.findIndex(i => i.name == name), 1)[0];
            node.active = true;
            return node;
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