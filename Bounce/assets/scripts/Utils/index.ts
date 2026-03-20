import { Vec3 } from "cc";

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
}


