System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, GM, ResMgr, _crd;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  function _reportPossibleCrUseOfGM(extras) {
    _reporterNs.report("GM", "../GM", _context.meta, extras);
  }

  _export("ResMgr", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
    }, function (_unresolved_2) {
      GM = _unresolved_2.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "621141m+MRKC7nKf81fadMk", "ResMgr", undefined);

      __checkObsolete__(['Asset', 'AssetManager']);

      _export("ResMgr", ResMgr = class ResMgr {
        constructor() {
          this._Res = void 0;
        }

        static getInstance(bundle) {
          if (this._instance === null) {
            this._instance = new ResMgr();
            this._instance._Res = bundle;
          }

          return this._instance;
        }

        get Res() {
          return this._Res;
        }

        asyncLoad(path, callBack) {
          return _asyncToGenerator(function* () {
            return new Promise((resolve, reject) => {
              (_crd && GM === void 0 ? (_reportPossibleCrUseOfGM({
                error: Error()
              }), GM) : GM).ResMgr.Res.load(path, (finished, total) => {
                callBack(finished, total);
              }, (error, asset) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(asset);
                }
              });
            });
          })();
        }

      });

      ResMgr._instance = null;

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=5042fe5e00b8992ad7b03abb8eef326ecb320032.js.map