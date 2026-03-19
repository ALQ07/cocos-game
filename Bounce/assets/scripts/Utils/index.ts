import { Vec3 } from "cc";

/**
 * 计算点到点的单位向量
 * @param p1 起点
 * @param p2 终点
 * @returns 单位向量
 */
export const getUnitVector = (p1: Vec3, p2: Vec3): Vec3 => {
    const dir = new Vec3();
    Vec3.subtract(dir, p2, p1);
    return dir.normalize();
}
