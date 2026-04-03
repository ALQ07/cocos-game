import { _decorator, Component, Label, Node, tween, Color, director, Tween, UIOpacity } from 'cc';
import GM from 'db://assets/GM/GM';
import { UIEnum } from 'db://assets/GM/UIMgr/UIList';
const { ccclass, property } = _decorator;

@ccclass('UIMain')
export class UIMain extends Component {

    onLoad() {

    }

    beginGame() {
        GM.UIMgr.Close(this.node);
        GM.UIMgr.Open(UIEnum.UIGame);
    }

    start() {

    }

    protected onDestroy(): void {

    }
}
