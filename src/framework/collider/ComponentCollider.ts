import { Point } from "pixi.js";
import { BaseCollider } from "./BaseCollider";
import { ColliderData, ColliderDataType } from "./ColliderData";

/**
 * Component的碰撞
 */
export class ComponentCollider extends BaseCollider{
  constructor(){
    super();
    this.mColliderData.type = ColliderDataType.RECTANGLE;
  }

  /**
   * 获取碰撞数据
   */
  public getColliderData(): ColliderData |undefined{
    if(!this.component){
      return undefined;
    }
    if(this.colliderData.type == ColliderDataType.RECTANGLE){
      let bounds = this.component.getBounds()
      
      this.colliderData.rectangle.out.x = bounds.x
      this.colliderData.rectangle.out.y = bounds.y;
      if(this.colliderData.rectangle.source.width == 0){
        this.colliderData.rectangle.out.width = bounds.width;
      }
      if(this.colliderData.rectangle.source.height == 0){
        this.colliderData.rectangle.out.height = bounds.height;
      }
      if(this.colliderData.rectangle.out.height == 0 || this.colliderData.rectangle.out.width == 0){
        return undefined;
      }

     
    }
    return this.mColliderData;
  }

}