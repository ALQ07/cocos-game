import { _decorator, error, instantiate, Node, NodePool, Prefab, Widget } from 'cc';
import GM from '../GM';
import { eUIType, UIComponent } from './UIComponent';
const { ccclass, property } = _decorator;

export class UIResult {
    public data: any = null;
    public ui: any = null;
    public completed(ui: UIComponent) {

    }
}

export interface UIArg {
    closeCB?: (data: UIArg) => void;   //关闭回调
    openCB?: (ui: UIComponent) => void; //打开回调
    closeData?: any;                   //关闭时传递的数据
};


@ccclass('UIMgr')
export class UIMgr {
    private static _instance: UIMgr = null;
    //记录当前ui信息
    private uiInfos: { [key: string]: Node } = {};
    private uiList: { [key: string]: { [key: string]: Node } } = {};

    private uiRoot: Node;
    private uiCache: { [key: string]: NodePool } = {};
    private openingNum: number = 0;

    private layers: Node[] = [];

    public static getInstance(): UIMgr {
        if (this._instance === null) {
            this._instance = new UIMgr();
        }
        return this._instance;
    }

    init(mainNode: Node) {
        this.uiRoot = mainNode.getChildByName("UIRoot");
        const barHeight = 0;

        Object.keys(eUIType).filter(key => isNaN(Number(key))).forEach((one, index) => {
            if (parseInt(eUIType[one as any]) !== index) {
                error("UIMgr error: eUIType 不是连续的枚举！");
            }
            const uiTypeNode = new Node();
            uiTypeNode.name = one;
            this.layers.push(uiTypeNode);
            this.uiRoot.addChild(uiTypeNode);
            let wid = uiTypeNode.addComponent(Widget);
            wid.isAlignTop = true;
            wid.isAlignBottom = true;
            wid.isAlignLeft = true;
            wid.isAlignRight = true;
            wid.top = barHeight;
            wid.bottom = 0;
            wid.left = 0;
            wid.right = 0;
        });
    }

    public async Open(uiOpt: { name: string, prefab: string }, data?: any, afterClose?: () => void, openCb?: (error: string, uiComp: UIComponent) => void): Promise<any> {
        console.log(`[UIMgr.Open]try open, name:${uiOpt.name} prefab:${uiOpt.prefab}`);
        const ret: UIResult = new UIResult();

        this.openingNum++;

        let uiNode: Node = null;
        let uiComp: UIComponent = null;
        let errStr = null;
        if (this.uiCache[uiOpt.prefab]) {
            uiNode = this.uiCache[uiOpt.prefab].get();
        }

        try {
            if (!uiNode) {
                let uiPrefab = GM.ResMgr.Res.get(uiOpt.prefab, Prefab);
                if (!uiPrefab) {
                    uiPrefab = await GM.ResMgr.asyncLoad<Prefab>(uiOpt.prefab, (finished: number, total: number) => {

                    })
                    if (!uiPrefab) {
                        errStr = "[UIMgr.Open]load ui prefab failed, prefab: " + uiOpt.prefab;
                        throw new Error(errStr);
                    }
                }
                uiNode = instantiate(uiPrefab);
            }

            uiComp = uiNode.getComponent(UIComponent);

            if (!uiComp) {
                errStr = "[UIMgr.Open] error: invalid ui, have no UIComponent! " + uiOpt.prefab;
                throw new Error(errStr);
            }

            uiNode.name = uiOpt.name;
            uiComp.arg = data as UIArg;
            uiComp.prefabUrl = uiOpt.prefab;
            uiComp.afterClose = afterClose;

            if (this.layers[uiComp.uiType]) {
                let layer = this.layers[uiComp.uiType];
                this.CheckUIPropertyOnUIOpen(uiNode);//在UI打开时检查属性，并处理相应逻辑
                if (this.uiInfos[uiNode.uuid]) {
                    if (!uiNode.parent) {
                        error("Must have parent node!");
                    }
                    if (uiComp.multipleInstance) {
                        error("Must be false == multipleInstance !");
                    }
                } else {
                    this.uiInfos[uiNode.uuid] = uiNode;
                    if (!this.uiList[uiOpt.name]) {
                        this.uiList[uiOpt.name] = {};
                    }
                    this.uiList[uiOpt.name][uiNode.uuid] = uiNode;
                    layer.addChild(uiNode);
                    ret.ui = uiComp;
                    ret.completed(uiComp);
                }
                console.log(`[UIMgr.Open] opened, name:${uiOpt.name} prefab:${uiComp.prefabUrl}`);
            } else {
                uiNode.destroy();
                uiNode = null;
                errStr = "[UIMgr.Open] error: invalid ui type! " + uiComp.prefabUrl;
                throw new Error(errStr);
            }
        } catch (err) {
            console.error(err);
        }
        this.openingNum--;
        if (openCb) {
            openCb(null, uiComp);
        }
        return uiComp;
    }

    private CheckUIPropertyOnUIOpen(uiNode: Node) {
        //检查multipleInstance属性
        const uiBase = uiNode.getComponent(UIComponent);
        if (!uiBase.multipleInstance) {
            const uiNodeParent = uiNode.parent;
            if (uiNodeParent) {
                uiNode.setSiblingIndex(uiNodeParent.children.length - 1);//置顶
            }
            uiNode.active = true;//显示
        }
        if (uiBase.allInactive) {
            //需要隐藏所有的下级ui
            this.UpdateUIActiveByUIProperty(uiNode, false);
        }
        //todo...其他检查
    }

    /**
  * 根据UI的属性来，在每次打开或者关闭时更新UI的遮挡关系，以优化显示性能。
  *      按照层级从顶层至底层的顺序开始搜索整个UI列表，找到目标节点的下一个节点开始处理每个UI是否要显示或者影藏。
  * @param targetUiNode 用来定位从什么节点开始执行active更新。
  * @param active 
  */
    private UpdateUIActiveByUIProperty(targetUiNode: Node, active: boolean) {
        let lastUIAllInactive = false;
        let findNode = targetUiNode.parent ? false : true;//如果是已经在显示队列的UI需要查找，新UI不需要查找。
        const uiBase = targetUiNode.getComponent(UIComponent);
        for (let layerIndex = uiBase.uiType; layerIndex >= 0; layerIndex--) {
            const uiTypeRootNode = this.layers[layerIndex];
            for (let nodeIndex = uiTypeRootNode.children.length - 1; nodeIndex >= 0; nodeIndex--) {
                const uiNode = uiTypeRootNode.children[nodeIndex];
                if (!findNode && uiNode == targetUiNode) {
                    findNode = true;
                    continue;
                }
                if (findNode) {
                    if (active) {
                        const uiBase = uiNode.getComponent(UIComponent);
                        uiNode.active = !lastUIAllInactive || uiBase.keepActive;
                        lastUIAllInactive = lastUIAllInactive || uiBase.allInactive;
                    }
                    else {
                        const uiBase = uiNode.getComponent(UIComponent);
                        uiNode.active = uiBase.keepActive || false;
                    }
                }
            }
        }
    }

    private CheckUIPropertyOnUIClose(uiNode: Node) {
        const uiBase = uiNode.getComponent(UIComponent);
        if (uiBase.allInactive) {//需要显示下级ui
            this.UpdateUIActiveByUIProperty(uiNode, true);
        }
    }

    /**
     * 关闭一个UI Node
     * @param UIObject 继承自UIBase的对象
     */
    public Close(uiNode: Node) {
        if (!uiNode) return;

        const uiBase = uiNode.getComponent(UIComponent);
        if (uiBase) {
            this.CheckUIPropertyOnUIClose(uiNode);
            if (uiNode && uiNode.isValid && this.uiInfos[uiNode.uuid]) {
                delete this.uiInfos[uiNode.uuid];

                if (uiBase.cache) {
                    if (!this.uiCache[uiBase.prefabUrl]) {
                        this.uiCache[uiBase.prefabUrl] = new NodePool(uiBase.prefabUrl);
                    }
                    this.uiCache[uiBase.prefabUrl].put(uiNode);
                } else {
                    uiNode.removeFromParent();
                    uiNode.destroy();
                    uiNode = null;
                }
            }


            if (uiBase.afterClose) {
                uiBase.afterClose();
            }
        } else {
            error("UIMgr.Open error: invalid ui type! " + uiNode.name);
        }
    }
}
