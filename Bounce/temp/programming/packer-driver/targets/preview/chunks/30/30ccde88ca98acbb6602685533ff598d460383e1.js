System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, error, instantiate, Node, NodePool, Prefab, Widget, GM, eUIType, UIComponent, UIResult, _dec, _class2, _class3, _crd, ccclass, property, UIMgr;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  function _reportPossibleCrUseOfGM(extras) {
    _reporterNs.report("GM", "../GM", _context.meta, extras);
  }

  function _reportPossibleCrUseOfeUIType(extras) {
    _reporterNs.report("eUIType", "./UIComponent", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUIComponent(extras) {
    _reporterNs.report("UIComponent", "./UIComponent", _context.meta, extras);
  }

  _export("UIResult", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      error = _cc.error;
      instantiate = _cc.instantiate;
      Node = _cc.Node;
      NodePool = _cc.NodePool;
      Prefab = _cc.Prefab;
      Widget = _cc.Widget;
    }, function (_unresolved_2) {
      GM = _unresolved_2.default;
    }, function (_unresolved_3) {
      eUIType = _unresolved_3.eUIType;
      UIComponent = _unresolved_3.UIComponent;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "f702b87xOFAxJM0eBh4/3o6", "UIMgr", undefined);

      __checkObsolete__(['_decorator', 'error', 'instantiate', 'Node', 'NodePool', 'Prefab', 'Widget']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("UIResult", UIResult = class UIResult {
        constructor() {
          this.data = null;
          this.ui = null;
        }

        completed(ui) {}

      });

      ;

      _export("UIMgr", UIMgr = (_dec = ccclass('UIMgr'), _dec(_class2 = (_class3 = class UIMgr {
        constructor() {
          //记录当前ui信息
          this.uiInfos = {};
          this.uiList = {};
          this.uiRoot = void 0;
          this.uiCache = {};
          this.openingNum = 0;
          this.layers = [];
        }

        static getInstance() {
          if (this._instance === null) {
            this._instance = new UIMgr();
          }

          return this._instance;
        }

        init(mainNode) {
          this.uiRoot = mainNode.getChildByName("UIRoot");
          var barHeight = 0;
          Object.keys(_crd && eUIType === void 0 ? (_reportPossibleCrUseOfeUIType({
            error: Error()
          }), eUIType) : eUIType).filter(key => isNaN(Number(key))).forEach((one, index) => {
            console.assert(parseInt((_crd && eUIType === void 0 ? (_reportPossibleCrUseOfeUIType({
              error: Error()
            }), eUIType) : eUIType)[one]) == index, "UIMgr error: eUIType 不是连续的枚举！");
            var uiTypeNode = new Node();
            uiTypeNode.name = one;
            this.layers.push(uiTypeNode);
            this.uiRoot.addChild(uiTypeNode);
            var wid = uiTypeNode.addComponent(Widget);
            wid.isAlignTop = true;
            wid.isAlignBottom = true;
            wid.isAlignLeft = true;
            wid.isAlignRight = true;
            wid.top = barHeight;
            wid.bottom = 0;
            wid.left = 0;
            wid.right = 0;
          });
        }

        Open(uiOpt, data, afterClose, openCb) {
          var _this = this;

          return _asyncToGenerator(function* () {
            console.log("[UIMgr.Open]try open, name:" + uiOpt.name + " prefab:" + uiOpt.prefab);
            var ret = new UIResult();
            _this.openingNum++;
            var uiNode = null;
            var uiComp = null;
            var errStr = null;

            if (_this.uiCache[uiOpt.prefab]) {
              uiNode = _this.uiCache[uiOpt.prefab].get();
            }

            try {
              if (!uiNode) {
                var uiPrefab = (_crd && GM === void 0 ? (_reportPossibleCrUseOfGM({
                  error: Error()
                }), GM) : GM).ResMgr.Res.get(uiOpt.prefab, Prefab);

                if (!uiPrefab) {
                  uiPrefab = yield (_crd && GM === void 0 ? (_reportPossibleCrUseOfGM({
                    error: Error()
                  }), GM) : GM).ResMgr.asyncLoad(uiOpt.prefab, (finished, total) => {});

                  if (!uiPrefab) {
                    errStr = "[UIMgr.Open]load ui prefab failed, prefab: " + uiOpt.prefab;
                    throw new Error(errStr);
                  }
                }

                uiNode = instantiate(uiPrefab);
                uiComp = uiNode.getComponent(_crd && UIComponent === void 0 ? (_reportPossibleCrUseOfUIComponent({
                  error: Error()
                }), UIComponent) : UIComponent);

                if (uiComp && uiComp.cache) {
                  if (!_this.uiCache[uiOpt.prefab]) {
                    _this.uiCache[uiOpt.prefab] = new NodePool(uiOpt.prefab);
                  }

                  _this.uiCache[uiOpt.prefab].put(uiNode);

                  console.log("[UIMgr.Open] cache, name:" + uiOpt.name + " prefab:" + uiComp.prefabUrl);
                  return yield _this.Open(uiOpt, data);
                }

                if (!uiComp) {
                  uiComp = uiNode.getComponent(_crd && UIComponent === void 0 ? (_reportPossibleCrUseOfUIComponent({
                    error: Error()
                  }), UIComponent) : UIComponent);
                }

                if (!uiComp) {
                  errStr = "[UIMgr.Open] error: invalid ui, have no UIComponent! " + uiOpt.prefab;
                  throw new Error(errStr);
                }

                uiNode.name = uiOpt.name;
                uiComp.arg = data;
                uiComp.prefabUrl = uiOpt.prefab;
                uiComp.afterClose = afterClose;

                if (_this.layers[uiComp.uiType]) {
                  var layer = _this.layers[uiComp.uiType];

                  _this.CheckUIPropertyOnUIOpen(uiNode); //在UI打开时检查属性，并处理相应逻辑


                  if (_this.uiInfos[uiNode.uuid]) {
                    console.assert(!!uiNode.parent, "Must have parent node!");
                    console.assert(!uiComp.multipleInstance, "Must be false == multipleInstance !");
                  } else {
                    _this.uiInfos[uiNode.uuid] = uiNode;

                    if (!_this.uiList[uiOpt.name]) {
                      _this.uiList[uiOpt.name] = {};
                    }

                    _this.uiList[uiOpt.name][uiNode.uuid] = uiNode;
                    var _ui = null; // if (uiOpt.script) {
                    //   ui = uiNode.addComponent(uiOpt.script);
                    // }

                    _ui = uiNode.getComponent(_crd && UIComponent === void 0 ? (_reportPossibleCrUseOfUIComponent({
                      error: Error()
                    }), UIComponent) : UIComponent);
                    layer.addChild(uiNode);
                    ret.ui = _ui;
                    ret.completed(_ui); // GM.EventMgr.Emit(GM.EventMgr.EventList.UI_TYPE_UI_OPEN, uiNode);
                    // if (GM.SDKMgr.AD.IsShowBanner() && ui.showBannerAD) {
                    //     GM.SDKMgr.AD.ShowBanner();
                    // }
                  }

                  _this.uiInfos[uiNode.uuid] = uiNode;
                  var _ui2 = null;

                  if (uiOpt.name) {
                    _ui2 = uiNode.getComponent(uiOpt.name);
                  }

                  layer.addChild(uiNode);
                  console.log("[UIMgr.Open] opened, name:" + uiOpt.name + " prefab:" + uiComp.prefabUrl);
                } else {
                  uiNode.destroy();
                  uiNode = null;
                  errStr = "[UIMgr.Open] error: invalid ui type! " + uiComp.prefabUrl;
                  throw new Error(errStr);
                }
              }
            } catch (err) {
              console.error(err);
            }

            _this.openingNum--;

            if (openCb) {
              openCb(null, uiComp);
            }

            return uiComp;
          })();
        }

        CheckUIPropertyOnUIOpen(uiNode) {
          //检查multipleInstance属性
          var uiBase = uiNode.getComponent(_crd && UIComponent === void 0 ? (_reportPossibleCrUseOfUIComponent({
            error: Error()
          }), UIComponent) : UIComponent);

          if (!uiBase.multipleInstance) {
            var uiNodeParent = uiNode.parent;

            if (uiNodeParent) {
              uiNode.setSiblingIndex(uiNodeParent.children.length - 1); //置顶
            }

            uiNode.active = true; //显示
          }

          if (uiBase.allInactive) {
            //需要隐藏所有的下级ui
            this.UpdateUIActiveByUIProperty(uiNode, false);
          } //todo...其他检查

        }
        /**
        * 根据UI的属性来，在每次打开或者关闭时更新UI的遮挡关系，以优化显示性能。
        *      按照层级从顶层至底层的顺序开始搜索整个UI列表，找到目标节点的下一个节点开始处理每个UI是否要显示或者影藏。
        * @param targetUiNode 用来定位从什么节点开始执行active更新。
        * @param active 
        */


        UpdateUIActiveByUIProperty(targetUiNode, active) {
          var lastUIAllInactive = false;
          var findNode = targetUiNode.parent ? false : true; //如果是已经在显示队列的UI需要查找，新UI不需要查找。

          var uiBase = targetUiNode.getComponent(_crd && UIComponent === void 0 ? (_reportPossibleCrUseOfUIComponent({
            error: Error()
          }), UIComponent) : UIComponent);

          for (var layerIndex = uiBase.uiType; layerIndex >= 0; layerIndex--) {
            var uiTypeRootNode = this.layers[layerIndex];

            for (var nodeIndex = uiTypeRootNode.children.length - 1; nodeIndex >= 0; nodeIndex--) {
              var uiNode = uiTypeRootNode.children[nodeIndex];

              if (!findNode && uiNode == targetUiNode) {
                findNode = true;
                continue;
              }

              if (findNode) {
                if (active) {
                  var _uiBase = uiNode.getComponent(_crd && UIComponent === void 0 ? (_reportPossibleCrUseOfUIComponent({
                    error: Error()
                  }), UIComponent) : UIComponent);

                  uiNode.active = !lastUIAllInactive || _uiBase.keepActive;
                  lastUIAllInactive = lastUIAllInactive || _uiBase.allInactive;
                } else {
                  var _uiBase2 = uiNode.getComponent(_crd && UIComponent === void 0 ? (_reportPossibleCrUseOfUIComponent({
                    error: Error()
                  }), UIComponent) : UIComponent);

                  uiNode.active = _uiBase2.keepActive || false;
                }
              }
            }
          }
        }

        CheckUIPropertyOnUIClose(uiNode) {
          var uiBase = uiNode.getComponent(_crd && UIComponent === void 0 ? (_reportPossibleCrUseOfUIComponent({
            error: Error()
          }), UIComponent) : UIComponent);

          if (uiBase.allInactive) {
            //需要显示下级ui
            this.UpdateUIActiveByUIProperty(uiNode, true);
          }
        }
        /**
         * 关闭一个UI Node
         * @param UIObject 继承自UIBase的对象
         */


        Close(uiNode) {
          if (!uiNode) return;
          var uiBase = uiNode.getComponent(_crd && UIComponent === void 0 ? (_reportPossibleCrUseOfUIComponent({
            error: Error()
          }), UIComponent) : UIComponent);

          if (uiBase) {
            this.CheckUIPropertyOnUIClose(uiNode);

            if (uiNode && uiNode.isValid && this.uiInfos[uiNode.uuid]) {
              delete this.uiInfos[uiNode.uuid];

              if (uiBase.cache) {
                this.uiCache[uiBase.prefabUrl].put(uiNode);
              } else {
                uiNode.removeFromParent();
                uiNode.destroy();
                uiNode = null;
              }
            }

            if (uiBase.afterClose) {
              uiBase.afterClose();
            }
          } else {
            error("UIMgr.Open error: invalid ui type! " + uiNode.name);
          }
        }

      }, _class3._instance = null, _class3)) || _class2));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=30ccde88ca98acbb6602685533ff598d460383e1.js.map