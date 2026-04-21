import { _decorator, Component, Label, Node, tween, Color, director, Tween, UIOpacity, v3 } from 'cc';
import GM from '../../../GM/GM';
import { UIEnum } from '../../../GM/UIMgr/UIList';
import { Start } from '../../../start/Start';
import { WxCloudManager } from '../../Golbal/WxCloudManager';

const { ccclass, property } = _decorator;

@ccclass('UIMain')
export class UIMain extends Component {
    private userInfoBtn: any = null;

    @property(Node)
    titile: Node = null;

    @property(Node)
    rankListBtn: Node = null;

    @property(Node)
    musicOpen: Node = null;

    @property(Node)
    musicClose: Node = null;

    protected onEnable(): void {
        Start.showBg();
    }

    protected onDisable(): void {
        Start.hideBg();
    }

    async onLoad() {
        this.init();
    }

    async init() {
        GM.AudioMgr.play(GM.AudioMgr.AudioData.BGM, true, 5);
        GM.AudioMgr.setBgmVolume(GM.CacheMgr.get('isMusicOpen', true) ? 1 : 0);
        this.musicOpen.active = GM.CacheMgr.get('isMusicOpen', true);
        this.musicClose.active = !this.musicOpen.active;
        GM.AudioMgr.setEffectVolume(GM.CacheMgr.get('isEffectOpen', true) ? 1 : 0);

        this.setTitleAni();
        WxCloudManager.Instance.init(this.rankListBtn);
        const info = await WxCloudManager.Instance.getWxUserInfo().catch(() => null);
        if (info) {
            if (info == 'ok') {
                // 创建用户信息按钮
                this.userInfoBtn = WxCloudManager.Instance.createUserInfoBtn();
            }
        }
        if (GM.CacheMgr.get<boolean>('isDead', false)) {
            await this.clearCache();
            GM.CacheMgr.set('isDead', false);
        }
    }

    beginGame() {
        GM.UIMgr.Close(this.node);
        GM.UIMgr.Open(UIEnum.UIGame, null, () => {
            GM.CacheMgr.get('isMusicOpen') && GM.AudioMgr.setBgmVolume(5);
        }, () => {
            GM.AudioMgr.setBgmVolume(0);
        });
    }

    async toRankingList() {
        GM.UIMgr.Open(UIEnum.UIRankList);
    }

    switchMusic() {
        GM.CacheMgr.set('isMusicOpen', !GM.CacheMgr.get('isMusicOpen', true));
        this.musicOpen.active = GM.CacheMgr.get('isMusicOpen');
        this.musicClose.active = !GM.CacheMgr.get('isMusicOpen');
        GM.AudioMgr.setBgmVolume(GM.CacheMgr.get('isMusicOpen') ? 1 : 0);
    }

    setTitleAni() {
        if (!this.titile) return;

        // 获取标题初始位置，用于上下浮动基准
        const startPos = this.titile.getPosition();

        // 1. 旋转摆动（模拟微风吹拂的摇曳感）
        tween(this.titile)
            .to(2.0, { angle: 3 }, { easing: 'sineInOut' })  // 向一侧倾斜 3 度
            .to(2.0, { angle: -3 }, { easing: 'sineInOut' }) // 向另一侧倾斜 -3 度
            .union()
            .repeatForever()
            .start();

        // 2. 上下轻微浮动（增加悬浮和呼吸感）
        tween(this.titile)
            .to(1.5, { position: v3(startPos.x, startPos.y + 10, startPos.z) }, { easing: 'sineInOut' }) // 向上浮动 10 像素
            .to(1.5, { position: v3(startPos.x, startPos.y, startPos.z) }, { easing: 'sineInOut' })      // 回到原位
            .union()
            .repeatForever()
            .start();
    }

    async clearCache() {
        // 上传排行榜数据
        const userInfo = await WxCloudManager.Instance.getWxUserInfo().catch(() => null);
        if (userInfo) WxCloudManager.Instance.getFuncFromCloud('upLoadUserInfo', { ...userInfo, score: GM.CacheMgr.get<number>('score') || 0 });
        // 清除缓存中的所有游戏状态，确保init时不会加载旧数据
        GM.CacheMgr.delete('blockRankList');
        GM.CacheMgr.delete('score');
        GM.CacheMgr.delete('round');
        GM.CacheMgr.delete('curBallNum');
    }

    protected onDestroy(): void {
        Tween.stopAllByTarget(this.titile);
        if (this.userInfoBtn) {
            this.userInfoBtn.destroy();
        }
    }
}
