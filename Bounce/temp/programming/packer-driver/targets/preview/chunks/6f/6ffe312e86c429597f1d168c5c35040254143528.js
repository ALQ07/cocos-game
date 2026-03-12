System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, _crd, UIEnum;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "f1b2cIKaKlA2ZTo4PeUR2uj", "UIList", undefined);

      //枚举所有UI
      _export("UIEnum", UIEnum = {
        ///////////////////////////////////////框架内部UI//////////////////////////////////////
        /////////////////////////////////////普通UI////////////////////////////////////////////

        /** 游戏界面 */
        UIGame: {
          name: 'UIGame',
          prefab: 'Prefabs/pages/UIGame'
        }
      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=6ffe312e86c429597f1d168c5c35040254143528.js.map