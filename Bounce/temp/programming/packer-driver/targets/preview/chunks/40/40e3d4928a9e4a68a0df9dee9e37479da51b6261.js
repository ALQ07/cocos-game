System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Vec3, Utils, _crd;

  _export("default", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      Vec3 = _cc.Vec3;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "ab8e0nPNvlFLY0SV8tNVNHt", "index", undefined);

      __checkObsolete__(['Vec3']);

      _export("default", Utils = class Utils {});

      /**
       * 计算点到点的单位向量
       * @param p1 起点
       * @param p2 终点
       * @returns 单位向量
       */
      Utils.getUnitVector = (p1, p2) => {
        var dir = new Vec3();
        Vec3.subtract(dir, p2, p1);
        return dir.normalize();
      };

      /**
       * 延时等待
       * @param time （秒）
       * @returns 
       */
      Utils.delay = time => {
        return new Promise(res => {
          setTimeout(res, time * 1000);
        });
      };

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=40e3d4928a9e4a68a0df9dee9e37479da51b6261.js.map