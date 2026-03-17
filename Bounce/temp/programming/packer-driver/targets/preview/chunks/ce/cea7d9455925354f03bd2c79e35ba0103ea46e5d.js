System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, _dec, _class, _crd, ccclass, property, Entity;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "fa2e7l+4q9AZ7bK3Yu6lpCS", "Entity", undefined);

      __checkObsolete__(['_decorator', 'Component']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("Entity", Entity = (_dec = ccclass("Entity"), _dec(_class = class Entity extends Component {}) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=cea7d9455925354f03bd2c79e35ba0103ea46e5d.js.map