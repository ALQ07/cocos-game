import { _decorator, Component, Node, Toggle } from 'cc';
import GM from 'db://assets/GM/GM';
import { UIEnum } from 'db://assets/GM/UIMgr/UIList';
import { DataManager } from '../../Golbal/DataManager';
import { GameMgr } from '../../Stage/GameMgr';
const { ccclass, property } = _decorator;

@ccclass('UISetting')
export class UISetting extends Component {
    @property(Node)
    switchEffectToggle: Node = null!;

    @property(Node)
    switchMusicToggle: Node = null!;

    @property(Node)
    switchShakeToggle: Node = null!;


    start() {
        this.init();
    }

    init() {
        this.switchEffectToggle.active = GM.CacheMgr.get('isEffectOpen', true);
        this.switchMusicToggle.active = GM.AudioMgr.BgmVolume > 0;
        this.switchShakeToggle.active = GM.CacheMgr.get('isShakeOpen', true);
    }

    /**
     * 重新开始游戏
     */
    restartGame() {
        GameMgr.Instance.restartGame();
        GM.UIMgr.Close(this.node);
    }

    /**
     * 返回主页
     */
    backToMain() {
        GM.UIMgr.Close(DataManager.Instance.node);
        GM.UIMgr.Close(this.node);
        GM.UIMgr.Open(UIEnum.UIMain);
    }

    /**
     * 前往排行榜
     */
    toRankingList() {
        GM.UIMgr.Open(UIEnum.UIRankList);
    }

    /**
     * 音效开关
     */
    switchEffect() {
        this.switchEffectToggle.active = !this.switchEffectToggle.active;
        GM.CacheMgr.set('isEffectOpen', this.switchEffectToggle.active);
        GM.AudioMgr.setEffectVolume(this.switchEffectToggle.active ? 1 : 0);
    }

    /**
     * 音乐开关
     */
    switchMusic() {
        this.switchMusicToggle.active = !this.switchMusicToggle.active;
        GM.CacheMgr.set('isMusicOpen', this.switchMusicToggle.active);
        GM.AudioMgr.setBgmVolume(this.switchMusicToggle.active ? 1 : 0);
    }

    /**
     * 震动开关
     */
    switchShake() {
        this.switchShakeToggle.active = !this.switchShakeToggle.active;
        GM.CacheMgr.set('isShakeOpen', this.switchShakeToggle.active);
    }
}


