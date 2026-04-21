import { _decorator, Button, Component, EditBox, Label, Node, Sprite } from 'cc';
import { UIComponent } from 'db://assets/GM/UIMgr/UIComponent';
import { UIArg } from 'db://assets/GM/UIMgr/UIMgr';
import { InfiniteScrollView } from 'db://assets/GM/Utils/InfiniteScrollView';
import Utils from '../../Utils';
import GM from 'db://assets/GM/GM';
import { WxCloudManager } from '../../Golbal/WxCloudManager';
const { ccclass, property } = _decorator;

export interface UIRankListArg extends UIArg {
    result: {
        data: {
            nickName: string,
            score: number,
            avatarUrl: string,
            isBot: boolean
        }[]
    }
}

@ccclass('UIRankList')
export class UIRankList extends Component {
    @property(Node)
    content: Node = null;
    private itemNum: number = 0;
    private itemIndex: number = 0;

    private arg: UIRankListArg = null;

    async onLoad() {
        this.content.children.forEach(node => node.active = false);
        // const userInfo = await WxCloudManager.Instance.getWxUserInfo().catch(() => null);
        // if (!userInfo) return Utils.ShowTip('请先开启授权');
        // WxCloudManager.Instance.getFuncFromCloud('upLoadUserInfo', { ...userInfo, score: GM.CacheMgr.get<number>('score') || 0 });
        const info = await WxCloudManager.Instance.getFuncFromCloud('getRankListInfo').catch(() => null);
        if (!info) return Utils.ShowTip('获取排行榜数据失败');
        this.arg = info as UIRankListArg;
        this.setRankList();
    }

    setRankList() {
        const length = this.arg.result.data.length;
        this.content.getComponent(InfiniteScrollView).initData(length, (itemNode: Node, index: number) => {
            itemNode.getChildByPath('rank').getComponent(Label).string = (index + 1).toString();
            itemNode.getChildByPath('name').getComponent(Label).string = this.arg.result.data[index].nickName;
            itemNode.getChildByPath('score').getComponent(Label).string = this.arg.result.data[index].score.toString();
            if (this.arg.result.data[index].isBot) {
                WxCloudManager.Instance.loadCloudImage(this.arg.result.data[index].avatarUrl, itemNode.getChildByPath('head/img').getComponent(Sprite));
            } else {
                Utils.setRemoteSpriteFrame(itemNode.getChildByPath('head/img'), this.arg.result.data[index].avatarUrl);
            }
            itemNode.getChildByPath('rankBg').children.forEach((node, i) => {
                if (i < 3) {
                    node.active = i == index;
                } else {
                    node.active = index >= 3;
                }
            })
            itemNode.getChildByPath('hat').children.forEach((node, i) => {
                node.active = index < 3 && i == index;
            })
        });
    }

    onClickButton() {
        console.log('click button');
    }

    endEdit(editBox: EditBox) {
        this.itemNum = parseInt(editBox.string);
    }

    endEditIndex(editBox: EditBox) {
        this.itemIndex = parseInt(editBox.string);
    }

    refresh() {
        this.content.getComponent(InfiniteScrollView).refreshItems(this.itemNum);
    }

    scrollToIndex() {
        this.content.getComponent(InfiniteScrollView).scrollToIndex(this.itemIndex);
    }
}


