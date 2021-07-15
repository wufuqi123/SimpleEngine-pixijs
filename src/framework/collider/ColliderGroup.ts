import { BaseCollider } from "./BaseCollider";

/**
 * 碰撞的组
 * 用来分组的
 */
export class ColliderGroup {
  private mColliderList: Array<BaseCollider> = new Array();

  /**
   * 是否开启碰撞
   */
  public active = true;
  /**
   * 组名
   */
  public name: string = "";

  /**
   * 添加碰撞
   * @param collider
   */
  public addCollider(collider: BaseCollider) {
    if (!this.mColliderList.includes(collider)) {
      this.mColliderList.push(collider);
    }
  }

  /**
   * 移除碰撞
   * @param collider
   */
  public remove(collider: BaseCollider) {
    this.mColliderList.remove(collider);
  }

  /**
   * 获取当前组里的碰撞
   */
  public getColliders(): Array<BaseCollider> {
    let arr = new Array();
    this.mColliderList.forEach((v) => {
      arr.push(v);
    });
    return arr;
  }

  

  /**
   * 每帧在执行
   * @param deltaMS this
   */
  public update(deltaMS: number) {
    if (!this.active) {
      return;
    }
    //检测碰撞  比较
    for(let i = 0;i<this.mColliderList.length;i++){
      for(let j = i;j<this.mColliderList.length;j++){
        let source = this.mColliderList[i];
        let target = this.mColliderList[j];
        if(source == target){
          continue;
        }
        let isContact = source.detection(target);
        target.sendEvent(isContact,source);
      }
    }
  }
}
