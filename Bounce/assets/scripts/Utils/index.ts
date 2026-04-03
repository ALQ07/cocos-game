import { director, game, Node, PhysicsSystem, PhysicsSystem2D, Sprite, SpriteFrame, Vec3 } from "cc";
import GM from "../../GM/GM";

export default class Utils {
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

}
