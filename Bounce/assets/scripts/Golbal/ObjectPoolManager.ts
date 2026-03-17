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

    init() {
        if (!this.objectPool) {
            this.objectPool = new Node("ObjectPool");
            this.objectPool.parent = DataManager.Instance.stage;
        }
    }

    async get(type: EntityTypeEnum) {
        if (!this.objectPool) console.error('ObjectPool未成功初始化');
        if (!this.map.has(type)) {
            this.map.set(type, []);
            const container = new Node(type + 'Pool');
            container.parent = this.objectPool;
        }

        const nodes = this.map.get(type);
        if (!nodes.length) {
            const prefab = await GM.ResMgr.asyncLoad<Prefab>(`Prefabs/entity/${type}/${type}`, () => { });
            const node = instantiate(prefab);
            node.name = type;
            node.parent = this.objectPool.getChildByName(type + 'Pool');
            node.active = true;
            return node;
        } else {
            const node = nodes.pop();
            node.active = true;
            return node;
        }
    }

    ret(node: Node) {
        node.active = false;
        this.map.get(node.name as EntityTypeEnum).push(node);
    }
}