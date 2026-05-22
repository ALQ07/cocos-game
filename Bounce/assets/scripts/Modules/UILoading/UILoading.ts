import { _decorator, Component, Node } from 'cc';
import Utils from '../../Utils';
import GM from 'db://assets/GM/GM';
import { UIComponent } from 'db://assets/GM/UIMgr/UIComponent';
const { ccclass, property } = _decorator;

@ccclass('UILoading')
export class UILoading extends Component {

    private _showTip: boolean = false;

    protected onEnable(): void {
        const arg = this.node.getComponent(UIComponent).arg;
        this._showTip = arg ? arg.showTip : false;

        this.scheduleOnce(this.onTimeout, 5);
    }

    protected onDisable(): void {
        this.unschedule(this.onTimeout);
    }

    private onTimeout() {
        GM.UIMgr.Close(this.node);
        if (this._showTip) Utils.ShowTip(`请求超时，请检查网络`);
    }
}
