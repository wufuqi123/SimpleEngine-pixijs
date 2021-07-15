import { Point } from "pixi.js";
import { Log } from "../log/Log";
import { BaseCollider } from "./BaseCollider";
import { ColliderData, ColliderDataType } from "./ColliderData";

/**
 * 圆的碰撞
 */
export class CircleColloder extends BaseCollider {
    point1: Point;
    point2: Point;
    constructor(x: number = 0, y: number = 0, radius: number = 0) {
        super();
        this.mColliderData.type = ColliderDataType.ROUND;
        this.point1 = new Point();
        this.point2 = new Point();

        this.mColliderData.circle.source.x = x;
        this.mColliderData.circle.source.y = y;
        this.mColliderData.circle.source.radius = radius;
    }

    /**
   * 获取碰撞数据
   */
    public getColliderData(): ColliderData | undefined {
        if (!this.component) {
            return undefined;
        }
        if (this.colliderData.type == ColliderDataType.ROUND) {
            // let p = this.component.toGlobal(new Point(this.mColliderData.circle.source.x, this.mColliderData.circle.source.y));
            // let p2 = this.component.toGlobal(new Point(this.mColliderData.circle.source.x + this.mColliderData.circle.source.radius, 0));
            this.point1.x = this.mColliderData.circle.source.x;
            this.point1.y = this.mColliderData.circle.source.y;
            this.point2.x = this.mColliderData.circle.source.x + this.mColliderData.circle.source.radius;
            let p = this.component.toGlobal(this.point1);
            let p2 = this.component.toGlobal(this.point2);
            this.mColliderData.circle.out.x = p.x;
            this.mColliderData.circle.out.y = p.y;
            this.mColliderData.circle.out.radius = Math.abs(p.x - p2.x);
            //   this.mColliderData.circle.out.radius = this.mColliderData.circle.source.radius*this.component.worldScale.x;
            //   Log.info("klasdjaklsjd001",this.mColliderData.circle.out.x,this.mColliderData.circle.out.y,this.mColliderData.circle.out.radius,this.mColliderData.circle.source.radius*this.component.worldScale.x);
        }
        return this.mColliderData;
    }
}