System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, assetManager, Component, director, DynamicAtlasManager, log, macro, UIMgr, ResMgr, UIEnum, _dec, _class, _class2, _crd, ccclass, property, GM;

  function _reportPossibleCrUseOfUIMgr(extras) {
    _reporterNs.report("UIMgr", "./UIMgr/UIMgr", _context.meta, extras);
  }

  function _reportPossibleCrUseOfResMgr(extras) {
    _reporterNs.report("ResMgr", "./ResMgr/ResMgr", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUIEnum(extras) {
    _reporterNs.report("UIEnum", "./UIMgr/UIList", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      assetManager = _cc.assetManager;
      Component = _cc.Component;
      director = _cc.director;
      DynamicAtlasManager = _cc.DynamicAtlasManager;
      log = _cc.log;
      macro = _cc.macro;
    }, function (_unresolved_2) {
      UIMgr = _unresolved_2.UIMgr;
    }, function (_unresolved_3) {
      ResMgr = _unresolved_3.ResMgr;
    }, function (_unresolved_4) {
      UIEnum = _unresolved_4.UIEnum;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "33d0dot6BZIZ7vkvJpHT17+", "GM", undefined);

      __checkObsolete__(['_decorator', 'assetManager', 'AssetManager', 'Component', 'director', 'DynamicAtlasManager', 'log', 'macro', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("default", GM = (_dec = ccclass('GM'), _dec(_class = (_class2 = class GM extends Component {
        // static AudioMgr: AudioMgr;
        // static GuideMgr: GuideMgr;
        // static PlayerPM: PlayerPrefsMgr;
        // static RPM: RedPointMgr;
        async start() {
          // 初始化插件plugin
          // initExcel(excel);
          // 先加载 res bundle
          const bundle = await this.LoadAssetsBundle('res'); //初始化框架

          GM.Init(this.node, bundle); //加载第一个UI

          await GM.UIMgr.Open((_crd && UIEnum === void 0 ? (_reportPossibleCrUseOfUIEnum({
            error: Error()
          }), UIEnum) : UIEnum).UIGame);
        }
        /**
        * 框架初始化操作
        */


        static Init(mainNode, bundle) {
          director.addPersistRootNode(mainNode);
          macro.CLEANUP_IMAGE_CACHE = false;
          DynamicAtlasManager.instance.enabled = true;
          DynamicAtlasManager.instance.maxFrameSize = 512;
          window["GM"] = GM;
          GM.ResMgr = (_crd && ResMgr === void 0 ? (_reportPossibleCrUseOfResMgr({
            error: Error()
          }), ResMgr) : ResMgr).getInstance(bundle); // GM.ConfigMgr = ConfigMgr.getInstance();
          // GM.LogMgr = LogMgr.getInstance();
          // GM.EventMgr = EventMgr.getInstance();
          // GM.SDKMgr = SDKMgr.getInstance();

          GM.UIMgr = (_crd && UIMgr === void 0 ? (_reportPossibleCrUseOfUIMgr({
            error: Error()
          }), UIMgr) : UIMgr).getInstance(); // GM.Network = Network.getInstance();
          // GM.DataMgr = DataMgr.getInstance();
          // GM.ProtocolMgr = ProtocolMgr.getInstance();
          // GM.AudioMgr = AudioMgr.getInstance();
          // GM.GuideMgr = GuideMgr.getInstance();
          // GM.PlayerPM = PlayerPrefsMgr.getInstance();
          // GM.RPM = RedPointMgr.getInstance();

          (_crd && UIMgr === void 0 ? (_reportPossibleCrUseOfUIMgr({
            error: Error()
          }), UIMgr) : UIMgr).getInstance().init(mainNode); // AudioMgr.getInstance().Init(mianNode);
          // DataMgr.getInstance().TestToolMgr.init(mianNode);

          log("GM inited"); // GM.AudioMgr.SetButtonSound();
        }

        LoadAssetsBundle(bundleName) {
          return new Promise((resolve, reject) => {
            assetManager.loadBundle(bundleName, (err, bundle) => {
              if (err) {
                reject(err);
              } else {
                resolve(bundle);
              }
            });
          });
        }

      }, _class2.UIMgr = void 0, _class2.ResMgr = void 0, _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=6a7101b6fe3f7c66905ddb918eb136f047d101a8.js.map