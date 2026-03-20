import { BoxCollider2D, CircleCollider2D, PolygonCollider2D } from "cc";

export enum EntityTypeEnum {
    Ball = 'ball',
    Block = 'block'
}

export enum ColliderTypeEnum {
    Box,
    Circle,
    Polygon
}

export type ColliderType = BoxCollider2D | CircleCollider2D | PolygonCollider2D;