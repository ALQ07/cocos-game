import { _decorator, Component, Node } from 'cc';
import { GameMgr } from '../../Stage/GameMgr';
import GM from '../../../GM/GM';
import { UIEnum } from '../../../GM/UIMgr/UIList';
import { UIArg } from '../../../GM/UIMgr/UIMgr';
import { UIComponent } from '../../../GM/UIMgr/UIComponent';
import { DataManager } from '../../Golbal/DataManager';
const { ccclass, property } = _decorator;

export interface UIGameoverArg extends UIArg {
    isDead: boolean;
}

@ccclass('UIGameover')
export class UIGameover extends Component {
    private arg: UIGameoverArg;

    protected onLoad(): void {
        this.arg = this.node.getComponent(UIComponent).arg as UIGameoverArg;
        this.node.getChildByPath('clickBg').on(Node.EventType.TOUCH_START, this.onCLose, this);
    }

    update(deltaTime: number) {

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
        GM.UIMgr.Close(GameMgr.Instance.node);
        GM.UIMgr.Close(this.node);
        GM.UIMgr.Open(UIEnum.UIMain);
    }

    /**
     * 前往排行榜
     */
    toRankingList() {
        GM.UIMgr.Open(UIEnum.UIRankList);
    }

    onCLose() {
        if (this.arg.isDead) return;
        GM.UIMgr.Close(this.node);
    }
}
