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
        }[],
        myRank: number,
        myInfo: {
            nickName: string,
            score: number,
            avatarUrl: string,
            isBot: boolean
        }
    }
}

@ccclass('UIRankList')
export class UIRankList extends Component {
    @property(Node)
    content: Node = null;
    @property(Node)
    mineItem: Node = null;
    @property(Label)
    refreshLabel: Label = null;

    private itemNum: number = 0;
    private itemIndex: number = 0;

    private arg: UIRankListArg = null;
    private sv: InfiniteScrollView = null;

    async onLoad() {
        this.sv = this.content.getComponent(InfiniteScrollView);
        this.content.children.forEach(node => node.active = false);
        this.mineItem.active = false;
        // const userInfo = await WxCloudManager.Instance.getWxUserInfo().catch(() => null);
        // if (!userInfo) return Utils.ShowTip('请先开启授权');
        // WxCloudManager.Instance.getFuncFromCloud('upLoadUserInfo', { ...userInfo, score: GM.CacheMgr.get<number>('score') || 0 });
        const info = await WxCloudManager.Instance.getFuncFromCloud('getRankListInfo').catch(() => null);
        if (!info) return Utils.ShowTip('获取排行榜数据失败');
        this.arg = info as UIRankListArg;

        // 1. 设置触发下拉刷新的距离阈值（不设置或为0将无法触发下拉逻辑）
        // this.sv.pullDownRefreshThreshold = 100;

        // 2. 监听下拉状态变化（是否达到阈值）
        this.sv.setPullDownStateCallback((isReady: boolean, offset: number, isTouching: boolean, isRefreshing: boolean) => {
            // 优先判断：如果正在刷新中，保持文本显示
            if (isRefreshing) {
                this.refreshLabel.node.active = true;
                this.refreshLabel.string = `正在刷新数据...`;
                return;
            }

            // 如果不是手指正在拖拽（即松手后的普通回弹），或者越界距离太小，则直接隐藏
            if (!isTouching || offset < 30) {
                // this.refreshLabel.node.active = false;
                this.refreshLabel.string = `下拉更新数据 ↓`
                return;
            }
            this.refreshLabel.node.active = true;
            if (isReady) {
                // 超过阈值（可以结合 offset 做提示回弹动画）
                this.refreshLabel.string = `松开立即刷新`;
            } else {
                // 未超过阈值（可以利用 offset 做一个透明度渐变或箭头旋转动画）
                this.refreshLabel.string = `继续下拉 ↓`;
            }
        });

        this.sv.setPullDownCallback(() => {
            console.log('正在刷新数据');
            this.upLoadRankInfo().then(() => {
                // 2. 上传数据后，重新拉取最新的排行榜数据
                return WxCloudManager.Instance.getFuncFromCloud('getRankListInfo');
            }).then((newInfo) => {
                if (newInfo) {
                    this.arg = newInfo as UIRankListArg; // 更新本地数据
                    this.sv.refreshItems(this.arg.result.data.length); // 传入最新数据量刷新列表
                }
                console.log('刷新完成');
                this.sv.stopRefresh();
            }).catch(() => {
                console.log('刷新失败');
                this.sv.stopRefresh();
            });
        })
        this.setRankList();
    }

    setRankList() {
        const length = this.arg.result.data.length;
        this.sv.initData(length, (itemNode: Node, index: number) => {
            itemNode.getChildByPath('rank').getComponent(Label).string = (index + 1).toString();
            itemNode.getChildByPath('name').getComponent(Label).string = this.arg.result.data[index].nickName;
            itemNode.getChildByPath('score').getComponent(Label).string = this.arg.result.data[index].score.toString();
            Utils.setSpriteFrame(itemNode.getChildByPath('head/img'), 'UI/Game/default_sprite');
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

        if (!this.arg.result.myInfo) return;
        this.mineItem.active = true;
        // this.mineItem.getChildByPath('name').getComponent(Label).string = this.arg.result.myInfo.nickName;
        this.mineItem.getChildByPath('score').getComponent(Label).string = this.arg.result.myInfo.score.toString();
        this.mineItem.getChildByPath('rank').getComponent(Label).string = this.arg.result.myRank.toString();
        Utils.setSpriteFrame(this.mineItem.getChildByPath('head/img'), 'UI/Game/default_sprite');
        if (this.arg.result.myInfo.isBot) {
            WxCloudManager.Instance.loadCloudImage(this.arg.result.myInfo.avatarUrl, this.mineItem.getChildByPath('head/img').getComponent(Sprite));
        } else {
            Utils.setRemoteSpriteFrame(this.mineItem.getChildByPath('head/img'), this.arg.result.myInfo.avatarUrl);
        }
    }

    async upLoadRankInfo() {
        // 上传排行榜数据
        try {
            const userInfo = await WxCloudManager.Instance.getWxUserInfo();
            // 注意：当玩家未授权时 getWxUserInfo 返回了 'ok'，这里必须确保拿到的是真正的对象数据
            if (userInfo && userInfo !== 'ok') {
                const maxScore = GM.CacheMgr.get<number>('maxScore', 0);
                return await WxCloudManager.Instance.getFuncFromCloud('upLoadUserInfo', { ...userInfo, score: maxScore }, false, false);
            }
        } catch (error) {
            console.error("上传排行榜数据失败: ", error);
            return null;
        }
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
