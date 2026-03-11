System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, _dec, _class, _class2, _crd, ccclass, property, UIMgr;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "f702b87xOFAxJM0eBh4/3o6", "UIMgr", undefined);

      __checkObsolete__(['_decorator', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("default", UIMgr = (_dec = ccclass('UIMgr'), _dec(_class = (_class2 = class UIMgr {
        static getInstance() {
          if (this._instance === null) {
            this._instance = new UIMgr();
          }

          return this._instance;
        }

        init(mainNode) {}

      }, _class2._instance = null, _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=30ccde88ca98acbb6602685533ff598d460383e1.js.map