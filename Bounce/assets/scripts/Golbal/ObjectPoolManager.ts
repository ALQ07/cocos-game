import { instantiate, Node, Prefab } from "cc";
import Singleton from "../Base/Singleton";
import { DataManager } from "./DataManager";
import GM from "../../GM/GM";
import { BlockShape, EntityTypeEnum } from "../Enum";

export class ObjectPoolManager extends Singleton {
    public static get Instance() {
        return super.GetInstance<ObjectPoolManager>();
    }

    private objectPool: Node = null;
    private map: Map<EntityTypeEnum, Node[]> = new Map();

    async init(): Promise<void> {
        try {
            await Promise.all([
                GM.ResMgr.asyncLoadDir('Prefabs/entity/ball', () => { }),
                GM.ResMgr.asyncLoadDir('Prefabs/entity/block', () => { }),
                GM.ResMgr.asyncLoadDir('Prefabs/entity/effect', () => { }),
                GM.ResMgr.asyncLoadDir('Sprites/ball', () => { }),
                GM.ResMgr.asyncLoadDir('Sprites/block', () => { })
            ]);

            // 预热小球
            const ballNum = 100;
            this.preWarm(EntityTypeEnum.Ball, ballNum);
            // 预热砖块
            this.preWarm(EntityTypeEnum.Block, 10, BlockShape.Circle);
            this.preWarm(EntityTypeEnum.Block, 10, BlockShape.Square);
            this.preWarm(EntityTypeEnum.Block, 10, BlockShape.Triangle);
            this.preWarm(EntityTypeEnum.Block, 5, BlockShape.Blind);
        } catch (error) {
            console.error('资源加载失败:', error);
        }
    }

    /**
     * 预热对象池
     * @param type 实体类型
     * @param count 预热数量
     * @param name 可选的具体名称
     */
    public preWarm(type: EntityTypeEnum, count: number, name?: string) {
        const tempNodes: Node[] = [];
        for (let i = 0; i < count; i++) {
            const node = this.get(type, name);
            if (node) {
                tempNodes.push(node);
            }
        }
        for (let i = 0; i < tempNodes.length; i++) {
            this.ret(tempNodes[i]);
        }
    }

    get(type: EntityTypeEnum, name?: string) {
        if (!this.objectPool || !this.objectPool.isValid) {
            this.objectPool = new Node("ObjectPool");
            this.objectPool.parent = DataManager.Instance.stage;
        }
        if (!this.map.has(type)) {
            this.map.set(type, []);
            const container = new Node(type + 'Pool');
            container.parent = this.objectPool;
        }

        const nodes = this.map.get(type);
        if (name && nodes.findIndex(i => i.name.includes(name)) === -1) {
            const path1 = `Prefabs/entity/${type}/${name}`;
            const prefab1 = GM.ResMgr.Res.get<Prefab>(path1);
            if (!prefab1) {
                console.error(`Prefab 加载失败: ${path1}, name: ${name}`);
                return null;
            }
            const parent = this.objectPool.getChildByName(type + 'Pool');
            const node = instantiate(prefab1);
            node.name = `${type}-${name}`;
            node.parent = parent;
            node.active = true;
            // if (parent.getChildByName('name')) {
            //     const nodeIndex = parent.getChildByName('name').getSiblingIndex();
            //     node.setSiblingIndex(nodeIndex);
            // }
            return node;
        }
        if (!nodes.length) {
            const path2 = `Prefabs/entity/${type}/${type}`;
            const prefab = GM.ResMgr.Res.get(path2) as Prefab;
            if (!prefab) {
                console.error(`Prefab 加载失败: ${path2}, type: ${type}`);
                return null;
            }
            const node = instantiate(prefab);
            node.name = type;
            node.parent = this.objectPool.getChildByName(type + 'Pool');
            node.active = true;
            return node;
        } else {
            const node = name ? nodes.splice(nodes.findIndex(i => i.name.includes(name)), 1)[0] : nodes.pop();
            node.active = true;
            return node;
        }
    }

    ret(node: Node) {
        node.active = false;
        this.map.get(node.name.split('-')[0] as EntityTypeEnum).push(node);
    }

    clear() {
        this.map.forEach((value, key) => {
            value.forEach(i => {
                i.removeFromParent();
            });
        });
        this.map.clear();
        this.objectPool.removeFromParent();
        this.objectPool = null;
    }
}