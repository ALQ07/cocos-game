import { _decorator, AssetManager, assetManager, Component, director, Node, Scene } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('start')
export class Start extends Component {
    public static _instance: Start = null;
    public static Bg: Node;

    public static get Instance() {
        return Start._instance;
    }

    protected onLoad(): void {
        Start._instance = this;
    }

    protected async start() {
        director.addPersistRootNode(this.node);
        Start.Bg = this.node.getChildByPath("Bg");

        //加载静态资源包
        //const staticResBundle = await this.LoadAssetsBundle("static_res");
        //加载框架包
        // const plugin = await this.LoadAssetsBundle("plugin");
        const gmBundle = await this.LoadAssetsBundle("GM");
        const scriptBundle = await this.LoadAssetsBundle("scripts");

        const resBundle = await this.LoadAssetsBundle("res");

        gmBundle.preloadScene("GM", (error) => {
            if (error) {
                console.log(error);
            }
            director.loadScene("GM", (error: null | Error, scene?: Scene) => {
                if (scene) {
                    scene.getChildByPath('Canvas').addChild(Start.Bg);
                    Start.Bg.setSiblingIndex(0);
                    this.node.destroy();
                }
            });
        });
    }

    public static showBg() {
        Start.Bg.active = true;
        // start.Bg.setSiblingIndex(100);
    }

    public static hideBg() {
        Start.Bg.active = false;
    }

    LoadAssetsBundle(bundleName: string): Promise<AssetManager.Bundle> {
        return new Promise((resolve, reject) => {
            assetManager.loadBundle(bundleName, (err, bundle: AssetManager.Bundle) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(bundle);
                }
            })
        });
    }
}
