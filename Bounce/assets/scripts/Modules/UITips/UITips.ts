import { _decorator, Component, find, Graphics, Node, RichText, Size, tween, UITransform, v3, Widget } from 'cc';
import GM from 'db://assets/GM/GM';
import { UIComponent } from 'db://assets/GM/UIMgr/UIComponent';

const { ccclass, property } = _decorator;

const wait = (time: number) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('ok')
        }, time * 1000)
    })
}

export interface UITipsUIArg {
    text: string,
    itemId?: number,
    common?: tipType,//默认为通用
}
/**提示类型 */
export enum tipType {
    common = 1,//通用
    quenching = 2,//淬炼额外提升
}

@ccclass('UITips')
export class UITips extends Component {
    private rectWidth: number = 0
    private rectHeight: number = 60
    private textWidth: number = 0
    private content: Node = null
    private tips: Node = null
    private startTop: number = 0

    protected onLoad() {
        this.tips = find('Canvas/UIRoot/Tips')
        this.startTop = this.node.getComponent(Widget).top
        this.node.setSiblingIndex(0)
        const arg: UITipsUIArg = this.node.getComponent(UIComponent).arg
        if (arg) {
            let sprite = find('content/Sprite', this.node)
            const text = arg.text;
            if (arg.common) {
                switch (arg.common) {
                    case tipType.common:
                        this.move();
                        break;
                    case tipType.quenching:
                        // this.node.setPosition(v3(0, 100, 0));
                        this.node.setScale(v3(0.7, 0.7, 1));
                        break;
                    default:
                        this.move();
                        break;
                }
            } else {
                this.move();
            }

            this.addText(text)
            if (arg.itemId) {
                sprite.active = true;
                // Utils.setSpriteFrame(sprite.getComponent(Sprite), excel.Item_item[arg.itemId].Icon, SpriteType.icon)
            } else {
                sprite.active = false
            }
        }
    }

    addText(string: string) {
        // const newText: Node = new Node()
        // newText.layer = Layers.Enum.UI_2D
        // const newLabel = newText.addComponent(Label)
        // newLabel.overflow = Overflow.NONE
        // newLabel.fontSize = 32
        // newLabel.lineHeight = 32
        // newLabel.enableWrapText = false
        // newLabel.string = `${string || '未知错误'}`
        // newLabel.updateRenderData(true)
        const richText = find('content/RichText', this.node)
        richText.getComponent(RichText).string = `${string || 'msg为空'}`
        this.textWidth = richText.getComponent(UITransform).contentSize.width
        if (this.textWidth > 800) {
            this.textWidth = 800
            richText.getComponent(UITransform).setContentSize(new Size(800, 50))
        }
        let tweenDuration = 0.3
        tween(this.node).by(tweenDuration, {
            scale: v3(0.1, 0.1, 0)
        }).by(tweenDuration, {
            scale: v3(-0.1, -0.1, 0)
        }).call(() => {
            this.scheduleOnce(() => {
                tween(this.node).to(0.5, { scale: v3(0, 0, 0) }).call(() => {
                    GM.UIMgr.Close(this.node)
                    // this.node.destroy()
                }).start()
            }, 1)
        }).start()
        // this.drawRect()
    }

    // 绘制圆角矩形
    private drawRect() {
        this.rectWidth = this.textWidth + 200
        const graphics = this.node.getChildByName('graphics').getComponent(Graphics)
        // graphics.strokeColor = Color.RED;
        graphics.lineWidth = 2;
        graphics.lineCap = Graphics.LineCap.BUTT;
        graphics.roundRect(-this.rectWidth / 2, -30, this.rectWidth, this.rectHeight, 20);
        // 设置填充颜色
        graphics.fillColor.fromHEX('#000000A4')
        // 填充
        graphics.fill();
        // 绘制
        graphics.stroke();
    }

    move() {
        let length = this.tips.children.length
        let tweenDuration = 0.1
        if (length > 0) {
            this.tips.children.forEach((item, index) => {
                if (item != this.node) {
                    item.name = `${index}`
                    // tween(item).by(tweenDuration, { position: v3(0, 80, 0) }).start()
                    // item.getComponent(Widget).updateAlignment()
                    tween(item.getComponent(Widget)).to(tweenDuration, { top: this.startTop - (80 * index) }).start()
                }
            })
        }
    }
}


