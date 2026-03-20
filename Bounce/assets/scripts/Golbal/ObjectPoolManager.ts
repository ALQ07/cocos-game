import { instantiate, Node, Prefab } from "cc";
import Singleton from "../Base/Singleton";
import { DataManager } from "./DataManager";
import GM from "../../GM/GM";
import { EntityTypeEnum } from "../Enum";

export class ObjectPoolManager extends Singleton {
    public static get Instance() {
        return super.GetInstance<ObjectPoolManager>();
    }

    private objectPool: Node = null;
    private map: Map<EntityTypeEnum, Node[]> = new Map();

    async init(): Promise<void> {
        if (!this.objectPool) {
            this.objectPool = new Node("ObjectPool");
            this.objectPool.parent = DataManager.Instance.stage;
        }

        try {
            await Promise.all([
                GM.ResMgr.asyncLoadDir('Prefabs/entity/ball', () => { }),
                GM.ResMgr.asyncLoadDir('Prefabs/entity/block', () => { })
            ]);
        } catch (error) {
            console.error('预制体资源加载失败:', error);
        }
    }

    get(type: EntityTypeEnum, name?: string) {
        if (!this.objectPool) console.error('ObjectPool未成功初始化');
        if (!this.map.has(type)) {
            this.map.set(type, []);
            const container = new Node(type + 'Pool');
            container.parent = this.objectPool;
        }

        const nodes = this.map.get(type);
        if (name && nodes.findIndex(i => i.name == name) === -1) {
            const path = `Prefabs/entity/${type}/${name}`;
            const prefab = GM.ResMgr.Res.get(path) as Prefab;
            if (!prefab) {
                console.error(`Prefab 加载失败: ${path}, name: ${name}`);
                return null;
            }
            const parent = this.objectPool.getChildByName(type + 'Pool');
            const node = instantiate(prefab);
            node.name = name;
            node.parent = parent;
            node.active = true;
            if (parent.getChildByName('name')) {
                const nodeIndex = parent.getChildByName('name').getSiblingIndex();
                node.setSiblingIndex(nodeIndex);
            }
            return node;
        } else if (!nodes.length) {
            const path = `Prefabs/entity/${type}/${type}`;
            const prefab = GM.ResMgr.Res.get(path) as Prefab;
            if (!prefab) {
                console.error(`Prefab 加载失败: ${path}, type: ${type}`);
                return null;
            }
            const node = instantiate(prefab);
            node.name = type;
            node.parent = this.objectPool.getChildByName(type + 'Pool');
            node.active = true;
            return node;
        } else {
            const node = name ? nodes.pop() : nodes.splice(nodes.findIndex(i => i.name == name), 1)[0];
            node.active = true;
            return node;
        }
    }

    ret(node: Node) {
        node.active = false;
        // node.parent = null;
        this.map.get(node.name as EntityTypeEnum).push(node);
    }
}