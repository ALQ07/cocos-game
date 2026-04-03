import { _decorator, Component, Node } from 'cc';
import { GameMgr } from '../../Stage/GameMgr';
import GM from 'db://assets/GM/GM';
import { UIEnum } from 'db://assets/GM/UIMgr/UIList';
import { UIArg } from 'db://assets/GM/UIMgr/UIMgr';
import { UIComponent } from 'db://assets/GM/UIMgr/UIComponent';
const { ccclass, property } = _decorator;

export interface UIGameoverArg extends UIArg {
    isDead: boolean;
}

@ccclass('UIGameover')
export class UIGameover extends Component {
    private arg: UIGameoverArg;


    protected onLoad(): void {
        this.arg = this.node.getComponent(UIComponent).arg as UIGameoverArg;
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
        if (this.arg.isDead) {
            GameMgr.Instance.clearCache();
        }
        GameMgr.Instance.exitGame();
        GM.UIMgr.Close(this.node);
        GM.UIMgr.Open(UIEnum.UIMain);
    }
}


