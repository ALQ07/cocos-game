import { _decorator, Component, Label, Node, tween, Color, director, Tween, UIOpacity, v3 } from 'cc';
import GM from 'db://assets/GM/GM';
import { UIEnum } from 'db://assets/GM/UIMgr/UIList';
const { ccclass, property } = _decorator;

@ccclass('UIMain')
export class UIMain extends Component {
    @property(Node)
    titile: Node = null;


    onLoad() {
        this.init();
    }

    init() {
        GM.AudioMgr.play(GM.AudioMgr.AudioData.BGM, true);
        this.setTitleAni();
    }

    beginGame() {
        GM.UIMgr.Close(this.node);
        GM.UIMgr.Open(UIEnum.UIGame, null, () => {
            GM.AudioMgr.resume();
        }, () => {
            GM.AudioMgr.pause();
        });
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

    protected onDestroy(): void {
        Tween.stopAllByTarget(this.titile);
    }
}
