import { ColliderGroup } from "./ColliderGroup";
import { ColliderGroupManager } from "./ColliderGroupManager";

/**
 * 碰撞的Manager
 * 
 * 使用碰撞时   兼容  physicsEditor 的 cocos2d
 * 
 */
export class ColliderManager {

  /**
   * 是否开启碰撞
   */
  public static active = true;

  /**
   * 延迟毫秒
   * 
   * 值越大性能越高，碰撞检测间隔事件越长
   * 
   * 值越小越精确，性能越低
   * 
   * 值为负数默认为0.
   */
  public static delay = 0;
  
  protected static isUpdate = true;

  public static init(){
    
  }

  public static update(deltaMS: number) {
    if(!ColliderManager.active){
      return;
    }
    if(deltaMS<=0){
      return;
    }
    if(ColliderManager.delay<=0){
      ColliderGroupManager.update(deltaMS);
      ColliderManager.isUpdate = true;
    }else{
      if(!ColliderManager.isUpdate){
        return;
      }
      setTimeout(()=>{
        ColliderManager.isUpdate = true;
      },ColliderManager.delay)
      ColliderGroupManager.update(deltaMS);
      ColliderManager.isUpdate = false;
    }
  }

}