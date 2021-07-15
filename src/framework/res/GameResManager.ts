import { ResDestroyArray, ResLoadGroupManager } from "../../framework";

/**
 * 游戏资源管理类
 *
 * 资源加载等等
 */
export class GameResManager {
  /**
   * lib下的资源
   */
  public static GROUP_NAME_LIB = "lib";
  /**
   * 游戏内的资源
   */
  public static GROUP_NAME_GAME = "game";
  /**
   * 临时资源
   */
  public static GROUP_NAME_TEMP = "temp";

  /**
   * 不销毁的类型
   *
   * 如  noDestroyTypes里有  spine  则不会销毁spine
   */
  public static get noDestroyTypes(): ResDestroyArray<string> {
    return ResLoadGroupManager.noDestroyTypes;
  }

  /**
   * 获取缓存内已存在的资源
   * @param name
   */
  public static getRes(name: string): any {
    return ResLoadGroupManager.getRes(name);
  }

  /**
   * 初始化资源信息
   * @param resInfos
   */
  public static initResInfo(
    ...resInfos: { name: string; type: string; url: string; param?: any }[]
  ) {
    resInfos.forEach((info) =>
      ResLoadGroupManager.putResInfo(info.name, info.url, info.type, info.param)
    );
  }

  /**
   * 获取当前全部的组
   */
  public static getGroups(): Array<string> {
    return ResLoadGroupManager.getGroups();
  }

  /**
   * 加载lib资源
   * @param res
   * @param onProcess
   * @param onComplete
   */
  public static loadLib(
    res: Array<string>,
    onProcess?: (process: number, count: number, name: string) => void,
    onComplete?: () => void
  ) {
    GameResManager.loadGroup(
      res,
      GameResManager.GROUP_NAME_LIB,
      onProcess,
      onComplete
    );
  }

  /**
   * 加载游戏内资源
   * @param res
   * @param onProcess
   * @param onComplete
   */
  public static loadGame(
    res: Array<string>,
    onProcess?: (process: number, count: number) => void,
    onComplete?: () => void
  ) {
    GameResManager.loadGroup(
      res,
      GameResManager.GROUP_NAME_GAME,
      onProcess,
      onComplete
    );
  }

  /**
   * 加载临时资源
   * @param res
   * @param onProcess
   * @param onComplete
   */
  public static loadTemp(
    res: Array<string>,
    onProcess?: (process: number, count: number) => void,
    onComplete?: () => void
  ) {
    GameResManager.loadGroup(
      res,
      GameResManager.GROUP_NAME_TEMP,
      onProcess,
      onComplete
    );
  }

  /**
   * 加载  指定组的资源
   * @param res
   * @param group
   * @param onProcess
   * @param onComplete
   */
  public static loadGroup(
    res: Array<string>,
    group: string,
    onProcess?: (process: number, count: number, name: string) => void,
    onComplete?: () => void
  ) {
    ResLoadGroupManager.loadResNameArr(res, group, onProcess, onComplete);
  }

  /**
   * 销毁未被销毁的资源
   * @param type 资源类型  如 spine image 等   如果不填写则销毁全部
   */
  public static destroyOtherRes(type?: string) {
    ResLoadGroupManager.destroyOtherRes(type);
  }

  /**
   * 销毁资源
   * @param type 
   */
  public static destroyRes(res: string) {
    ResLoadGroupManager.destroyRes(res);
  }


  /**
   * 根据资源类型销毁资源
   * @param type  资源类型  如  spine  image
   * @param plug 此插件返回受否销毁此资源
   */
  public static destroyResType(type: string, plug?: (res: string, type: string, groups: Array<string>) => boolean) {
    ResLoadGroupManager.destroyResType(type, plug);
  }
  /**
   * 销毁组的资源
   * @param group 资源组名
   * @param isGDALL 是否移除全部组
   *                  false则只销毁当前组的资源,如果此资源在其他组里也存在,不会真销毁此资源
   *                  true则此资源彻底销毁  不管其他组里是否有此资源
   */
  public static destroyGroup(group: string, isGDALL?: boolean) {
    ResLoadGroupManager.destroyGroup(group, isGDALL);
  }

  /**
   * 销毁lib下的资源
   * @param isGDALL 是否移除全部组
   *                  false则只销毁当前组的资源,如果此资源在其他组里也存在,不会真销毁此资源
   *                  true则此资源彻底销毁  不管其他组里是否有此资源
   */
  public static destroyLib(isGDALL?: boolean) {
    GameResManager.destroyGroup(GameResManager.GROUP_NAME_LIB, isGDALL);
  }

  /**
   * 销毁游戏内的资源
   * @param isGDALL 是否移除全部组
   *                  false则只销毁当前组的资源,如果此资源在其他组里也存在,不会真销毁此资源
   *                  true则此资源彻底销毁  不管其他组里是否有此资源
   */
  public static destroyGame(isGDALL?: boolean) {
    GameResManager.destroyGroup(GameResManager.GROUP_NAME_GAME, isGDALL);
  }
  /**
   * 销毁临时的资源
   * @param isGDALL 是否移除全部组
   *                  false则只销毁当前组的资源,如果此资源在其他组里也存在,不会真销毁此资源
   *                  true则此资源彻底销毁  不管其他组里是否有此资源
   */
  public static destroyTemp(isGDALL?: boolean) {
    GameResManager.destroyGroup(GameResManager.GROUP_NAME_TEMP, isGDALL);
  }
}
