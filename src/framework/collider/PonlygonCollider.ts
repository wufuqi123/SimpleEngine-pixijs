import { Point } from "pixi.js";
import { Component } from "../core/Component";
import { Log } from "../log/Log";
import { BaseCollider } from "./BaseCollider";
import { ColliderData, ColliderDataType } from "./ColliderData";

/**
 * 多边形的碰撞
 */
export class PonlygonCollider extends BaseCollider {

    constructor(...param:Array<number>|Array<Point>) {
        super();
        this.mColliderData.type = ColliderDataType.POLYGON;
        this.mColliderData.poLygon.source.clear();
        if(Array.isArray(param)){
            let x = 0;
            param.forEach((v,i)=>{
                if(typeof v == "number"){
                    if(i%2 == 0){
                        x = v;
                    }else{
                        this.mColliderData.poLygon.source.push(new Point(x,v));
                    }
                }else{
                    this.mColliderData.poLygon.source.push(v);
                }
            });
        }
    }

    /**
     * 获取碰撞数据
     */
    public getColliderData(): ColliderData | undefined {
        if (!this.component) {
            return undefined;
        }
        if (this.colliderData.type == ColliderDataType.POLYGON) {
            this.mColliderData.poLygon.out.clear();
            this.mColliderData.poLygon.source.forEach(p=>{
                let p1 = (<Component>this.component).toGlobal(p);
                this.mColliderData.poLygon.out.push(p1.x,p1.y);
            });
        }
        return this.mColliderData;
    }
}