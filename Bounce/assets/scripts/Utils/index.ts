import { assetManager, director, game, ImageAsset, Node, PhysicsSystem, PhysicsSystem2D, Sprite, SpriteFrame, Texture2D, Vec3, isValid } from "cc";
import GM from "../../GM/GM";
import { UIEnum } from "../../GM/UIMgr/UIList";
import { UIArg } from "../../GM/UIMgr/UIMgr";

export default class Utils {
    private static remoteSpriteFrameCache: Map<string, SpriteFrame> = new Map();
    private static spriteToRemoteURL: WeakMap<Sprite, string> = new WeakMap();

    /**
     * 计算点到点的单位向量
     * @param p1 起点
     * @param p2 终点
     * @returns 单位向量
     */
    public static getUnitVector = (p1: Vec3, p2: Vec3): Vec3 => {
        const dir = new Vec3();
        Vec3.subtract(dir, p2, p1);
        return dir.normalize();
    }

    /**
     * 延时等待
     * @param time （秒）
     * @returns 
     */
    public static delay = (time: number) => {
        return new Promise((res) => {
            setTimeout(res, time * 1000);
        });
    }

    /**
     * 设置精灵图片
     * @param node 图片节点
     */
    public static setSpriteFrame = (node: Node | Sprite, path: string) => {
        const targetNode = node instanceof Node ? node : node.node;
        const sprite = targetNode.getComponent(Sprite) || targetNode.addComponent(Sprite);
        if (sprite) {
            // Cocos Creator 3.x 中动态获取 SpriteFrame 必须加上 /spriteFrame 后缀
            const sfPath = path.endsWith('/spriteFrame') ? path : `${path}/spriteFrame`;
            const spriteFrame = GM.ResMgr.Res.get<SpriteFrame>(sfPath, SpriteFrame);
            if (spriteFrame) {
                sprite.spriteFrame = spriteFrame;
            } else {
                console.error(`未找到路径为 ${sfPath} 的 SpriteFrame`);
            }
        }
    }



    /**
     * 设置远程图片
     * @param node 图片节点
     * @param path 远程图片路径
     */
    public static setRemoteSpriteFrame = (node: Node | Sprite, path: string) => {
        const targetNode = node instanceof Node ? node : node.node;
        const sprite = targetNode.getComponent(Sprite) || targetNode.addComponent(Sprite);

        if (sprite) {
            Utils.spriteToRemoteURL.set(sprite, path);
        }

        if (Utils.remoteSpriteFrameCache.has(path)) {
            if (sprite && isValid(sprite.node)) {
                sprite.spriteFrame = Utils.remoteSpriteFrameCache.get(path);
            }
            return;
        }

        // 远程 url 不带图片后缀名，此时必须指定远程图片文件的类型
        assetManager.loadRemote<ImageAsset>(path, { ext: '.jpg' }, (err, imageAsset) => {
            if (err) {
                console.error(err);
                return;
            }
            let spriteFrame = Utils.remoteSpriteFrameCache.get(path);
            if (!spriteFrame) {
                spriteFrame = new SpriteFrame();
                const texture = new Texture2D();
                texture.image = imageAsset;
                spriteFrame.texture = texture;
                Utils.remoteSpriteFrameCache.set(path, spriteFrame);
            }
            if (sprite && isValid(sprite.node)) {
                if (Utils.spriteToRemoteURL.get(sprite) === path) {
                    sprite.spriteFrame = spriteFrame;
                }
            }
        });
    }


    /**
    * 全局控制游戏速率（包含物理引擎）
    * @param scale 时间缩放倍率，1 为正常，0.5 为半速，2 为双倍速
    */
    public static setGlobalTimeScale = (scale: number) => {
        // 保存原始的 tick 函数，防止重复挂载导致内存泄漏或死循环
        if (!(director as any).originalTick) {
            (director as any).originalTick = director.tick;
        }
        // 1. 根据倍率动态计算需要的最大子步数
        // 如果是 2倍速，至少需要允许 1帧算 2~3 次。为了安全可以稍微给大一点。
        if (PhysicsSystem2D.instance) {
            PhysicsSystem2D.instance.maxSubSteps = Math.max(2, Math.ceil(scale * 2));
        }
        // 2. 重写 tick，在传入原始逻辑前将底层 dt 缩放
        director.tick = function (dt: number) {
            dt *= scale;
            (director as any).originalTick.call(director, dt);
        };
    }


    /**
    * 弹窗信息
    * @param msg 提示内容
    */
    public static ShowTip(msg: string, itemId?: number) {
        GM.UIMgr.Open(UIEnum.UITips, { text: msg, itemId } as UIArg)
    }
}
