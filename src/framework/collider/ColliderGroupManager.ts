import { BaseCollider } from "./BaseCollider";
import { ColliderGroup } from "./ColliderGroup";

/**
 * 碰撞的组的Manager
 */
export class ColliderGroupManager {
  private static mGroupMap: Map<string, ColliderGroup> = new Map();

  /**
   * 获取组
   * @param groupName 组名
   */
  public static getGroup(groupName: string): ColliderGroup {
    let group = this.mGroupMap.get(groupName);
    if (!group) {
      group = new ColliderGroup();
      group.name = groupName;
      this.mGroupMap.set(groupName, group);
    }
    return group;
  }

  /**
   * 添加碰撞
   * @param collider
   */
  public static addCollider(collider: BaseCollider) {
    this.getGroup(collider.group).addCollider(collider);
  }

  /**
   * 移除碰撞
   * @param collider
   */
  public static remove(collider: BaseCollider) {
    if (collider.group == undefined) {
      return;
    }
    this.getGroup(collider.group).remove(collider);
  }

  /**
   * 获取碰撞，groupName如果不填写则获取全部碰撞
   * @param groupName
   */
  public static getColliders(groupName?: string): Array<BaseCollider> {
    if (groupName) {
      return this.getGroup(groupName).getColliders();
    }
    let arr = new Array();
    this.mGroupMap.forEach((g) => {
      g.getColliders().forEach((a) => {
        if (!arr.includes(a)) {
          arr.push(a);
        }
      });
    });
    return arr;
  }

  /**
   * 每帧在执行
   * @param deltaMS 
   */
  public static update(deltaMS: number){
    ColliderGroupManager.mGroupMap.forEach(c=>{
      c.update(deltaMS);
    })
  }
}
