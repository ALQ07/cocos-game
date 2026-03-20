System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _crd, EntityTypeEnum, ColliderTypeEnum;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "bdcde8cnyBEXIgMxkp3Te3/", "index", undefined);

      __checkObsolete__(['BoxCollider2D', 'CircleCollider2D', 'PolygonCollider2D']);

      _export("EntityTypeEnum", EntityTypeEnum = /*#__PURE__*/function (EntityTypeEnum) {
        EntityTypeEnum["Ball"] = "ball";
        EntityTypeEnum["Block"] = "block";
        return EntityTypeEnum;
      }({}));

      _export("ColliderTypeEnum", ColliderTypeEnum = /*#__PURE__*/function (ColliderTypeEnum) {
        ColliderTypeEnum[ColliderTypeEnum["Box"] = 0] = "Box";
        ColliderTypeEnum[ColliderTypeEnum["Circle"] = 1] = "Circle";
        ColliderTypeEnum[ColliderTypeEnum["Polygon"] = 2] = "Polygon";
        return ColliderTypeEnum;
      }({}));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=63d1e81710188a3243f4555563d3c8756f885176.js.map