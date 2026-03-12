System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, BlockInputEvents, Component, Enum, Graphics, Node, Sprite, SpriteFrame, UITransform, _decorator, math, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _crd, eUIType, ccclass, property, menu, UIComponent;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      BlockInputEvents = _cc.BlockInputEvents;
      Component = _cc.Component;
      Enum = _cc.Enum;
      Graphics = _cc.Graphics;
      Node = _cc.Node;
      Sprite = _cc.Sprite;
      SpriteFrame = _cc.SpriteFrame;
      UITransform = _cc.UITransform;
      _decorator = _cc._decorator;
      math = _cc.math;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "34739TgHBNCP4fyyB/vG+0f", "UIComponent", undefined);

      __checkObsolete__(['BlockInputEvents', 'Color', 'Component', 'Enum', 'EventTouch', 'Graphics', 'Node', 'Sprite', 'SpriteFrame', 'UITransform', '_decorator', 'math']);

      _export("eUIType", eUIType = /*#__PURE__*/function (eUIType) {
        eUIType[eUIType["BG"] = 0] = "BG";
        eUIType[eUIType["UI"] = 1] = "UI";
        eUIType[eUIType["UI2"] = 2] = "UI2";
        eUIType[eUIType["UI3"] = 3] = "UI3";
        eUIType[eUIType["Toast"] = 4] = "Toast";
        eUIType[eUIType["Tips"] = 5] = "Tips";
        eUIType[eUIType["Loading"] = 6] = "Loading";
        return eUIType;
      }({}));

      ({
        ccclass,
        property,
        menu
      } = _decorator);
      /**
       * @author
       * 所有UI界面的基类，封装了UI的样式
       */

      _export("UIComponent", UIComponent = (_dec = menu("自定义脚本/UIComponent"), _dec2 = property({
        tooltip: "是否可多实例化"
      }), _dec3 = property({
        tooltip: "是否缓存，缓存的UI需要注意重复多次打开时的复用性问题。",
        visible: function visible() {
          return !this.multipleInstance;
        }
      }), _dec4 = property({
        type: Enum(eUIType || null)
      }), _dec5 = property({
        tooltip: "是否启用遮罩并屏蔽点击"
      }), _dec6 = property({
        type: SpriteFrame,
        tooltip: "遮罩图片",
        visible: function visible() {
          return this.mask;
        }
      }), _dec7 = property({
        tooltip: "遮罩颜色",
        visible: function visible() {
          return this.mask;
        }
      }), _dec8 = property({
        tooltip: "是否让下层所有UI处于失活（active=false）状态,全屏UI可以勾选此项"
      }), _dec9 = property({
        tooltip: "就算上层UI勾选了allInactive，依然保持激活状态"
      }), _dec10 = property({
        tooltip: "是否可以点击空白区域退出"
      }), _dec11 = property({
        tooltip: "点击穿透, 勾选则为不能穿透，反之亦然"
      }), ccclass(_class = _dec(_class = (_class2 = class UIComponent extends Component {
        constructor() {
          super(...arguments);
          this.maskbg = void 0;

          _initializerDefineProperty(this, "multipleInstance", _descriptor, this);

          _initializerDefineProperty(this, "cache", _descriptor2, this);

          _initializerDefineProperty(this, "uiType", _descriptor3, this);

          _initializerDefineProperty(this, "mask", _descriptor4, this);

          _initializerDefineProperty(this, "maskSpriteFrame", _descriptor5, this);

          _initializerDefineProperty(this, "maskColor", _descriptor6, this);

          _initializerDefineProperty(this, "allInactive", _descriptor7, this);

          _initializerDefineProperty(this, "keepActive", _descriptor8, this);

          //@property({ tooltip: "是否显示banner广告" })
          this.showBannerAD = false;

          _initializerDefineProperty(this, "onClose", _descriptor9, this);

          _initializerDefineProperty(this, "blockInputEvents", _descriptor10, this);

          this.prefabUrl = "";
          //当前UI如果是挂载再prefab上，则指示路径
          this.arg = null;
          //当前ui的启动参数
          this.afterClose = null;
        }

        // 关闭后处理函数
        start() {
          //遮罩
          // if (this.mask) {
          //     this.ShowMask();
          // }
          // //如果勾选了点击穿透;
          if (this.blockInputEvents) {
            this.node.addComponent(BlockInputEvents);
          } // GM.EventMgr.Emit(GM.EventMgr.EventList.UI_TYPE_UI_OPEN, this);
          // if (GM.SDKMgr.AD.IsShowBanner() && this.showBannerAD) {
          //     GM.SDKMgr.AD.ShowBanner();
          // }
          // if (this.onClose && this.mask) {
          //     this.maskbg.on(Node.EventType.TOUCH_START, (event: EventTouch) => {
          //         GM.UIMgr.Close(this.node);
          //     }, this)
          // }
          // if (this.onClose && !this.mask) {
          //     this.node.on(Node.EventType.TOUCH_START, (event: EventTouch) => {
          //         GM.UIMgr.Close(this.node);
          //     }, this)
          // }

        }

        onDestroy() {//
          // GM.EventMgr.Emit(GM.EventMgr.EventList.UI_TYPE_UI_CLOSE, this);
          // if (GM.SDKMgr.AD.IsShowBanner() && this.showBannerAD) {
          //     GM.SDKMgr.AD.HideBanner();
          // }
        }

        ShowMask() {
          var width = 3000;
          var height = 3000;
          this.maskbg = new Node("Umaskbg");
          this.maskbg.layer = this.node.layer;
          var uitrans = this.maskbg.addComponent(UITransform); //mask固定为zhezhao.png
          //const maskSprite = this.maskbg.addComponent(Sprite);
          //Utils.setSpriteFrame(maskSprite, 'zhezhao', 8);

          if (this.maskSpriteFrame) {
            var maskSprite = this.maskbg.addComponent(Sprite);
            maskSprite.spriteFrame = this.maskSpriteFrame;
            maskSprite.sizeMode = Sprite.SizeMode.RAW;
          } else {
            var g = this.maskbg.addComponent(Graphics);
            g.fillColor = this.maskColor;
            g.fillRect(-width / 2, -height / 2, width, height);
          }

          this.node.addChild(this.maskbg);
          uitrans.width = width;
          uitrans.height = height; // this.scheduleOnce(() => {
          //     uitrans.width = width;
          //     uitrans.height = height;
          // }, 0);

          this.maskbg.setSiblingIndex(0);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "multipleInstance", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "cache", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "uiType", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return eUIType.UI;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "mask", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "maskSpriteFrame", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "maskColor", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return math.color(0, 0, 0, 235);
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "allInactive", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "keepActive", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "onClose", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "blockInputEvents", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      })), _class2)) || _class) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=497e0b399bce1b6441b00b35a93b6bf50cfcd33a.js.map