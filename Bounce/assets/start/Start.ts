import { _decorator, AssetManager, assetManager, Component, director, Label, Node, ProgressBar, RenderTexture, Scene, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('start')
export class Start extends Component {
    public static _instance: Start = null;
    public static Bg: Node;

    @property(ProgressBar)
    progressBar: ProgressBar = null;
    @property(Label)
    progressLabel: Label = null;


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
        this.setProgress(0.1);
        const gmBundle = await this.LoadAssetsBundle("GM");
        this.setProgress(0.6);
        const scriptBundle = await this.LoadAssetsBundle("scripts");
        // const bg = await this.loadBg(resBundle);
        // Start.Bg.getComponent(Sprite).spriteFrame = bg;
        this.setProgress(0.8);
        const resBundle = await this.LoadAssetsBundle("res");
        this.setProgress(0.9);

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

    loadBg(bundle: AssetManager.Bundle): Promise<SpriteFrame> {
        return new Promise((resolve, reject) => {
            const path = `UI/Start/mainBG/spriteFrame`
            bundle.load(path, SpriteFrame, (finished: number, total: number) => {
            }, (error, asset) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(asset as SpriteFrame);
                }
            });
        })
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

    setProgress(value: number) {
        this.progressBar.progress = value;
        this.progressLabel.string = `资源加载中（${Math.floor(value * 100)}%）`;
    }
}
