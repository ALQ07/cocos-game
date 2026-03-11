System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Vec3, _crd, getUnitVector;

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

      /**
       * 计算点到点的单位向量
       * @param p1 起点
       * @param p2 终点
       * @returns 单位向量
       */
      __checkObsolete__(['Vec3']);

      _export("getUnitVector", getUnitVector = (p1, p2) => {
        const dir = new Vec3();
        Vec3.subtract(dir, p2, p1);
        return dir.normalize();
      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=40e3d4928a9e4a68a0df9dee9e37479da51b6261.js.map