import { sys } from 'cc';

export class CacheMgr {
    private static _instance: CacheMgr | null = null;
    private _cache: Map<string, any> = new Map();

    public static getInstance(): CacheMgr {
        if (!this._instance) {
            this._instance = new CacheMgr();
        }
        return this._instance;
    }

    /**
     * 设置缓存
     * @param key 缓存键
     * @param value 缓存值
     */
    public set(key: string, value: any): void {
        this._cache.set(key, value);
        sys.localStorage.setItem(key, JSON.stringify(value));
    }

    /**
     * 获取缓存
     * @param key 缓存键
     * @returns 返回对应的值，如果不存在则返回 null
     */
    public get<T>(key: string): T | null {
        if (this._cache.has(key)) {
            return this._cache.get(key) as T;
        }

        const localStr = sys.localStorage.getItem(key);
        if (localStr) {
            try {
                const value = JSON.parse(localStr);
                this._cache.set(key, value);
                return value as T;
            } catch (error) {
                console.error(`解析本地缓存失败，key: ${key}`, error);
            }
        }
        return null;
    }

    /**
     * 检查是否包含某个缓存
     */
    public has(key: string): boolean {
        return this._cache.has(key) || sys.localStorage.getItem(key) !== null;
    }

    /**
     * 删除缓存
     */
    public delete(key: string): void {
        this._cache.delete(key);
        sys.localStorage.removeItem(key);
    }

    /**
     * 清空所有缓存
     */
    public clear(): void {
        this._cache.clear();
        sys.localStorage.clear();
    }
}