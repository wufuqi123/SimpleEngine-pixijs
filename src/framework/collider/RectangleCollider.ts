import { Point } from "pixi.js";
import { BaseCollider } from "./BaseCollider";
import { ColliderData, ColliderDataType } from "./ColliderData";

/**
 * 矩形的碰撞
 */
export class RectangleCollider extends BaseCollider {
    point1: Point;
    point2: Point;
    
    constructor(x:number,y:number,width:number,height:number) {
        super();
        this.mColliderData.type = ColliderDataType.RECTANGLE;
        this.mColliderData.rectangle.source.x = x;
        this.mColliderData.rectangle.source.y = y;
        this.mColliderData.rectangle.source.width = width;
        this.mColliderData.rectangle.source.height = height;
        this.point1 = new Point();
        this.point2 = new Point();
    }

    /**
     * 获取碰撞数据
     */
    public getColliderData(): ColliderData | undefined {
        if (!this.component) {
            return undefined;
        }
        if (this.colliderData.type == ColliderDataType.RECTANGLE) {

            this.point1.x = this.mColliderData.rectangle.source.x;
            this.point1.y = this.mColliderData.rectangle.source.y;
            this.point2.x = this.mColliderData.rectangle.source.x + this.mColliderData.rectangle.source.width;
            this.point2.y = this.mColliderData.rectangle.source.y + this.mColliderData.rectangle.source.height;
            let p1 = this.component.toGlobal(this.point1);
            let p2 = this.component.toGlobal(this.point2);

            this.colliderData.rectangle.out.x = p1.x
            this.colliderData.rectangle.out.y = p1.y;
            this.colliderData.rectangle.out.width = Math.abs(p2.x - p1.x);
            this.colliderData.rectangle.out.height = Math.abs(p2.y - p1.y);

            if (this.colliderData.rectangle.out.height == 0 || this.colliderData.rectangle.out.width == 0) {
                return undefined;
            }
        }
        return this.mColliderData;
    }
}