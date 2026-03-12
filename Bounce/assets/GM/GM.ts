import { _decorator, assetManager, AssetManager, Component, director, DynamicAtlasManager, log, macro, Node } from 'cc';
import { UIMgr } from './UIMgr/UIMgr';
import { ResMgr } from './ResMgr/ResMgr';
import { UIEnum } from './UIMgr/UIList';
const { ccclass, property } = _decorator;

@ccclass('GM')
export default class GM extends Component {
    // static ConfigMgr: ConfigMgr;
    // static LogMgr: LogMgr;
    // static EventMgr: EventMgr;
    // static SDKMgr: SDKMgr;
    static UIMgr: UIMgr;
    // static Network: Network;
    // static DataMgr: DataMgr;
    // static ProtocolMgr: ProtocolMgr;
    static ResMgr: ResMgr;
    // static AudioMgr: AudioMgr;
    // static GuideMgr: GuideMgr;
    // static PlayerPM: PlayerPrefsMgr;
    // static RPM: RedPointMgr;

    onload

    protected async start(): Promise<void> {

        // 初始化插件plugin
        // initExcel(excel);

        // 先加载 res bundle
        const bundle = await this.LoadAssetsBundle('res');

        //初始化框架
        GM.Init(this.node, bundle);

        //加载第一个UI
        await GM.UIMgr.Open(UIEnum.UIGame);

    }

    /**
 * 框架初始化操作
 */
    public static Init(mainNode: Node, bundle: AssetManager.Bundle) {
        director.addPersistRootNode(mainNode);
        macro.CLEANUP_IMAGE_CACHE = false;
        DynamicAtlasManager.instance.enabled = true;
        DynamicAtlasManager.instance.maxFrameSize = 512;

        window["GM"] = GM;

        GM.ResMgr = ResMgr.getInstance(bundle);
        // GM.ConfigMgr = ConfigMgr.getInstance();
        // GM.LogMgr = LogMgr.getInstance();
        // GM.EventMgr = EventMgr.getInstance();
        // GM.SDKMgr = SDKMgr.getInstance();
        GM.UIMgr = UIMgr.getInstance();
        // GM.Network = Network.getInstance();
        // GM.DataMgr = DataMgr.getInstance();
        // GM.ProtocolMgr = ProtocolMgr.getInstance();
        // GM.AudioMgr = AudioMgr.getInstance();
        // GM.GuideMgr = GuideMgr.getInstance();
        // GM.PlayerPM = PlayerPrefsMgr.getInstance();
        // GM.RPM = RedPointMgr.getInstance();


        UIMgr.getInstance().init(mainNode);
        // AudioMgr.getInstance().Init(mianNode);
        // DataMgr.getInstance().TestToolMgr.init(mianNode);
        log("GM inited");

        // GM.AudioMgr.SetButtonSound();
    }


    LoadAssetsBundle(bundleName: string): Promise<AssetManager.Bundle> {
        return new Promise((resolve, reject) => {
            assetManager.loadBundle(bundleName, (err, bundle: AssetManager.Bundle) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(bundle);
                }
            })
        });
    }
}


