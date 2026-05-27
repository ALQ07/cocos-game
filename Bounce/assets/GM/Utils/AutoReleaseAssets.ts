import { _decorator, Asset, Component, isValid } from "cc";

declare module 'cc' {
    interface Component {
        addAutoReleaseAsset(_asset: Asset): void;
        addAutoReleaseAssets(_assets: Asset[]): void;
    }
}

Component.prototype.addAutoReleaseAsset = function (_asset: Asset) {
    // 防御性编程：防止异步加载完成时，当前脚本的节点已经被销毁
    if (!isValid(this) || !isValid(this.node)) {
        return;
    }
    let oneTempAuto = this.node.getComponent(AutoReleaseAssets);
    if (!isValid(oneTempAuto)) {
        oneTempAuto = this.node.addComponent(AutoReleaseAssets);
    }
    oneTempAuto.addAutoReleaseAsset(_asset);
};
Component.prototype.addAutoReleaseAssets = function (_assets: Asset[]) {
    // 防御性编程：防止异步加载完成时，当前脚本的节点已经被销毁
    if (!isValid(this) || !isValid(this.node)) {
        return;
    }
    let moreTempAuto = this.node.getComponent(AutoReleaseAssets);
    if (!isValid(moreTempAuto)) {
        moreTempAuto = this.node.addComponent(AutoReleaseAssets);
    }
    for (const _assetSelf of _assets) {
        moreTempAuto.addAutoReleaseAsset(_assetSelf);
    }
};



// AutoReleaseAssets
const { ccclass, menu, disallowMultiple } = _decorator;
@ccclass
@menu('资源管理/AutoReleaseAssets/自动释放资源')
@disallowMultiple
export default class AutoReleaseAssets extends Component {

    private dynamicsAssets: Asset[] = [];

    // onLoad () {}
    public addAutoReleaseAsset(_asset: Asset) {
        if (isValid(_asset)) {
            // 优化：避免同一个资源在同一个节点被重复追踪，节省数组内存
            if (!this.dynamicsAssets.includes(_asset)) {
                _asset.addRef();
                this.dynamicsAssets.push(_asset);
            }
        }
    };
    onDestroy(): void {
        // console.log("继承cc.Component拥有生命周期如果Node销毁就会顺带销毁这里"); 
        for (let index = 0; index < this.dynamicsAssets.length; index++) {
            if (isValid(this.dynamicsAssets[index])) {
                this.dynamicsAssets[index].decRef();
            }
        }
        this.dynamicsAssets = [];
    };
};
