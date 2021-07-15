import { AudioInterface } from "../audio/interface/AudioInterface";
import { ResManager } from "../core/ResManager";
import { Log } from "../log/Log";
import { ResDestroyArray } from "./ResDestroyArray";

/**
 * 资源加载管理器
 */
export class ResLoadGroupManager {
  /**
   * res 所对应的  group
   */
  private static mResGroupMap: Map<string, Array<string>> = new Map();

  private static _noDestroyTypes: ResDestroyArray<string> = new ResDestroyArray();
  private static _noDestroyRess: ResDestroyArray<{
    type: string;
    res: string;
  }> = new ResDestroyArray();

  /**
   * 不销毁的类型
   *
   * 如  noDestroyTypes里有  spine  则不会销毁spine
   */
  public static get noDestroyTypes(): ResDestroyArray<string> {
    return ResLoadGroupManager._noDestroyTypes;
  }

  /**
   * 通过资源名  获取  组
   * @param res
   */
  public static getGroupByRes(res: string): Array<string> {
    let arr = new Array();
    let group = ResLoadGroupManager.mResGroupMap.get(res);
    if (group) {
      arr.push(...group);
    }
    return arr;
  }

  /**
   * 获取当前全部的组
   */
  public static getGroups(): Array<string> {
    let arr = new Array();
    this.mResGroupMap.forEach((gs) =>
      gs.forEach((g) => (arr.includes(g) ? undefined : arr.push(g)))
    );
    return arr;
  }

  /**
   * 通过组名  获取  资源名
   * @param group
   */
  public static getResByGroup(group: string): Array<string> {
    let arr = new Array();
    ResLoadGroupManager.mResGroupMap.forEach((v, k) => {
      if (arr.includes(k)) {
        return;
      }
      if (v.includes(group)) {
        arr.push(k);
      }
    });
    return arr;
  }

  /**
   * 资源是否在组内存在
   * @param res 资源名
   * @param group 组名
   */
  public static isExistGroup(res: string, group: string): boolean {
    return ResLoadGroupManager.getGroupByRes(res).includes(group);
  }

  /**
   * 添加res的组信息
   * @param res
   * @param group
   */
  public static pushResGroup(res: string, ...group: string[]) {
    let groups = ResLoadGroupManager.mResGroupMap.get(res);
    if (!Array.isArray(groups)) {
      groups = new Array();
      ResLoadGroupManager.mResGroupMap.set(res, groups);
    }
    group.forEach((v) => {
      if (!groups) {
        return;
      }
      if (!groups.includes(v)) {
        groups.push(v);
      }
    });
  }

  /**
   * 加载资源
   * @param name 资源名
   * @param url 资源路径
   * @param type 资源类型
   * @param group 资源组
   * @param callback 加载完成回调
   */
  public static loadRes(
    name: string,
    url: string,
    type: string,
    group: string,
    callback: () => void
  ) {
    ResLoadGroupManager.pushResGroup(name, group);
    ResManager.loadRes(name, url, type, callback);
  }

  /**
   * 加载多个资源，如果资源已存在则不会再次加载
   * @param res 资源
   * @param group 资源组
   * @param onProcess 加载中
   * @param onComplete 加载完成
   */
  public static loadResArr(
    res: Array<{ name: string; url: string; type: string }>,
    group: string,
    onProcess?: (process: number, count: number) => void,
    onComplete?: () => void
  ) {
    res.forEach((v) => {
      ResLoadGroupManager.pushResGroup(v.name, group);
    });
    ResManager.loadResArr(res, onProcess, onComplete);
  }

  /**
   * 通过  资源名  加载资源名
   * @param name 资源名
   * @param group 资源组
   * @param callback 加载完成
   */
  public static loadNameRes(name: string, group: string, callback: () => void) {
    ResLoadGroupManager.pushResGroup(name, group);
    if (ResManager.isExist(name)) {
      callback();
      return;
    }
    let resObj = ResManager.getResInfo(name);
    if (resObj == undefined) {
      throw new Error("没有名为：【" + name + "】的配置资源表");
    }
    ResManager.asyncLoad(resObj.name, resObj.url, resObj.type, callback);
  }

  /**
   * 加载多个资源，如果资源已存在则不会再次加载
   * @param res
   * @param onProcess
   * @param onComplete
   */
  public static loadResNameArr(
    res: Array<string>,
    group: string,
    onProcess?: (process: number, count: number, name: string) => void,
    onComplete?: () => void
  ) {
    let resArr = new Array();
    res.forEach((name) => {
      let resObj = ResManager.getResInfo(name);
      if (resObj == undefined) {
        throw new Error("没有名为：【" + name + "】的配置资源表");
      }
      resArr.push(resObj);
      ResLoadGroupManager.pushResGroup(name, group);
    });
    if (resArr.length == 0) {
      onComplete && onComplete();
      return;
    }
    ResManager.loadResArr(resArr, onProcess, onComplete);
  }

  /**
   * 加载异常的资源
   *
   * 如果不填写资源名  加载全部的异常资源
   * @param res 资源名
   */
  public static loadErrorRes(res?: string) {
    ResManager.loadErrorRes(res);
  }

  /**
   * 获取缓存内已存在的资源
   * @param name
   */
  public static getRes(
    name: string
  ):
    | Object
    | undefined
    | string
    | PIXI.LoaderResource
    | PIXI.Texture
    | HTMLVideoElement
    | AudioInterface {
    return ResManager.getRes(name);
  }

  /**
   * 设置资源信息
   * @param name
   * @param url
   * @param type
   * @param param
   */
  public static putResInfo(
    name: string,
    url: string,
    type: string,
    param?: any
  ) {
    ResManager.putResInfo(name, url, type, param);
  }

  /**
   * 当前资源  是否存在资源信息
   * @param name
   */
  public static hasResInfo(name: string): boolean {
    return ResManager.hasResInfo(name);
  }

  /**
   * 获取资源信息
   * @param name
   */
  public static getResInfo(
    name: string
  ): { name: string; url: string; type: string; paramData?: any } | undefined {
    return ResManager.getResInfo(name);
  }

  /**
   * 销毁资源
   * @param type
   */
  public static destroyRes(res: string) {
    let groups = ResLoadGroupManager.mResGroupMap.get(res);
    ResLoadGroupManager.mResGroupMap.delete(res);
    groups?.clear();
    let arr = ResLoadGroupManager._noDestroyRess.toArray();
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].res == res) {
        ResLoadGroupManager._noDestroyRess.remove(arr[i]);
        break;
      }
    }
    ResManager.removeResource(res);
  }

  /**
   * 根据资源类型销毁资源
   * @param type  资源类型  如  spine  image
   * @param plug 此插件返回受否销毁此资源
   */
  public static destroyResType(
    type: string,
    plug?: (res: string, type: string, groups: Array<string>) => boolean
  ) {
    ResLoadGroupManager.mResGroupMap.forEach((_, res) => {
      let objInfo = ResLoadGroupManager.getResInfo(res);
      if (!objInfo) {
        return;
      }
      if (objInfo.type != type) {
        return;
      }
      let isDestroy =
        plug == undefined
          ? true
          : plug(res, type, ResLoadGroupManager.getGroupByRes(res));
      if (!isDestroy) {
        return;
      }
      ResLoadGroupManager.destroyRes(res);
    });
  }

  /**
   * 销毁未被销毁的资源
   * @param type 资源类型  如 spine image 等   如果不填写则销毁全部
   */
  public static destroyOtherRes(type?: string) {
    ResLoadGroupManager._noDestroyRess.toArray().forEach((obj) => {
      let isDestroy = false;
      if (type == undefined || type == obj.type) {
        isDestroy = true;
      }
      let groups = ResLoadGroupManager.mResGroupMap.get(obj.res);
      ResLoadGroupManager.mResGroupMap.delete(obj.res);
      groups?.clear();
      ResLoadGroupManager._noDestroyRess.remove(obj);
      ResManager.removeResource(obj.res);
    });
  }

  /**
   * 销毁组的资源
   * @param group 资源组名
   * @param isGDALL 是否移除全部组
   *                  false则只销毁当前组的资源,如果此资源在其他组里也存在,不会真销毁此资源
   *                  true则此资源彻底销毁  不管其他组里是否有此资源
   */
  public static destroyGroup(group: string, isGDALL?: boolean) {
    let ress = ResLoadGroupManager.getResByGroup(group);
    ress.forEach((res) => {
      let groups = ResLoadGroupManager.mResGroupMap.get(res);
      if (!groups) {
        ResLoadGroupManager.mResGroupMap.delete(res);
        return;
      }
      if (isGDALL) {
        groups.clear();
        groups.push(group);
      }
      if (groups.length == 1 && groups.includes(group)) {
        let objInfo = ResLoadGroupManager.getResInfo(res);
        if (
          objInfo &&
          ResLoadGroupManager.noDestroyTypes.includes(objInfo.type)
        ) {
          ResLoadGroupManager._noDestroyRess.push({ res, type: objInfo.type });
          return;
        }
        ResLoadGroupManager.mResGroupMap.delete(res);
        ResManager.removeResource(res);
        groups.clear();
      } else {
        groups.remove(group);
      }
    });
  }
}
