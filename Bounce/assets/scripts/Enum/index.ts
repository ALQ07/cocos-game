import { BoxCollider2D, CircleCollider2D, PolygonCollider2D } from "cc";

export enum EntityTypeEnum {
    Ball = 'ball',
    Block = 'block',
    Effect = 'effect'
}

export enum ColliderTypeEnum {
    Box,
    Circle,
    Polygon
}

export type ColliderType = BoxCollider2D | CircleCollider2D | PolygonCollider2D;

export enum BlockShape {
    Triangle = 'triangle',
    Square = 'square',
    Blind = 'blind'
}