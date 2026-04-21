import { BlockInputEvents, Color, Component, Enum, EventTouch, Graphics, Node, Sprite, SpriteFrame, UITransform, _decorator, math } from "cc";
import GM from "../GM";
export enum eUIType {//必须连续自增，因为要用做数组下标
    BG = 0,
    UI,
    UI2,
    UI3,
    Toast,
    Tips,
    Loading,
}

const { ccclass, property, menu } = _decorator;
/**
 * @author
 * 所有UI界面的基类，封装了UI的样式
 */
@ccclass
@menu("自定义脚本/UIComponent")
export class UIComponent extends Component {
    protected maskbg: Node;

    @property({ tooltip: "是否可多实例化" })
    readonly multipleInstance: boolean = false;
    @property({ tooltip: "是否缓存，缓存的UI需要注意重复多次打开时的复用性问题。", visible: function (this: UIComponent) { return !this.multipleInstance; } })
    readonly cache: boolean = false;

    @property({ type: Enum(eUIType || null) })
    readonly uiType: eUIType = eUIType.UI;

    @property({ tooltip: "是否启用遮罩并屏蔽点击" })
    readonly mask: boolean = true;

    @property({ type: SpriteFrame, tooltip: "遮罩图片", visible: function (this: UIComponent) { return this.mask; } })
    readonly maskSpriteFrame: SpriteFrame = null;

    @property({ tooltip: "遮罩颜色", visible: function (this: UIComponent) { return this.mask; } })
    readonly maskColor: Color = math.color(0, 0, 0, 235);

    @property({ tooltip: "是否让下层所有UI处于失活（active=false）状态,全屏UI可以勾选此项" })
    readonly allInactive: boolean = false;

    @property({ tooltip: "就算上层UI勾选了allInactive，依然保持激活状态" })
    readonly keepActive: boolean = false;

    //@property({ tooltip: "是否显示banner广告" })
    readonly showBannerAD: boolean = false;

    @property({ tooltip: "是否可以点击空白区域退出" })
    readonly onClose: boolean = false;

    @property({ tooltip: "点击穿透, 勾选则为不能穿透，反之亦然" })
    readonly blockInputEvents: boolean = true;

    public prefabUrl: string = "";//当前UI如果是挂载再prefab上，则指示路径
    public arg: any = null;   //当前ui的启动参数
    public afterClose: Function = null // 关闭后处理函数


    start() {
        //遮罩
        if (this.mask) {
            this.ShowMask();
        }
        // //如果勾选了点击穿透;
        if (this.blockInputEvents) {
            this.node.addComponent(BlockInputEvents);
        }
        // GM.EventMgr.Emit(GM.EventMgr.EventList.UI_TYPE_UI_OPEN, this);

        // if (GM.SDKMgr.AD.IsShowBanner() && this.showBannerAD) {
        //     GM.SDKMgr.AD.ShowBanner();
        // }

        if (this.onClose && this.mask) {
            this.maskbg.on(Node.EventType.TOUCH_START, (event: EventTouch) => {
                GM.UIMgr.Close(this.node);
            }, this)
        }
        if (this.onClose && !this.mask) {
            this.node.on(Node.EventType.TOUCH_START, (event: EventTouch) => {
                GM.UIMgr.Close(this.node);
            }, this)
        }
    }

    onDestroy() {
        //
        // GM.EventMgr.Emit(GM.EventMgr.EventList.UI_TYPE_UI_CLOSE, this);

        // if (GM.SDKMgr.AD.IsShowBanner() && this.showBannerAD) {
        //     GM.SDKMgr.AD.HideBanner();
        // }
    }

    private ShowMask() {
        const width = 3000;
        const height = 3000;
        this.maskbg = new Node("Umaskbg");
        this.maskbg.layer = this.node.layer;
        const uitrans = this.maskbg.addComponent(UITransform);
        //mask固定为zhezhao.png
        //const maskSprite = this.maskbg.addComponent(Sprite);
        //Utils.setSpriteFrame(maskSprite, 'zhezhao', 8);
        if (this.maskSpriteFrame) {
            const maskSprite = this.maskbg.addComponent(Sprite);
            maskSprite.spriteFrame = this.maskSpriteFrame;
            maskSprite.sizeMode = Sprite.SizeMode.RAW;
        } else {
            const g = this.maskbg.addComponent(Graphics);
            g.fillColor = this.maskColor;
            g.fillRect(-width / 2, -height / 2, width, height);
        }
        this.node.addChild(this.maskbg);
        uitrans.width = width;
        uitrans.height = height;
        // this.scheduleOnce(() => {
        //     uitrans.width = width;
        //     uitrans.height = height;
        // }, 0);
        this.maskbg.setSiblingIndex(0);
    }
}