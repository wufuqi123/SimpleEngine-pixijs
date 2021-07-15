import * as PIXI from "pixi.js";
import { AudioManager } from "../audio/AudioManager";
import { EventManager } from "../event/EventManager";
import { Log } from "../log/Log";
import { TextUtils } from "../utils/TextUtils";
/**
 * 资源类型，外部不会拿到
 */
const LoadType: any = {
  json: "data",
  res: "data",
  data: "data",
  plist: "plist",
  csv: "csv",
  bitmapFont: "BitmapFontData",
  image: "texture",
  font: "url",
  spine: "spineData",
  audio: "data",
  video: "data",
  texture: "textures",
  particle: "particleData",
};

const ExtensionType: any = {
  png: "image",
  jpg: "image",
  jpeg: "image",
  gif: "image",
};
/**
 * 资源管理器
 */
export class ResManager {
  public static noLoadingType: Array<string> = [];

  public static resLoader: PIXI.Loader;
  private static idle: boolean;
  public static resources: PIXI.IResourceDictionary;
  public static resourcesToDelete: Array<string>;
  public static assetsAll: Map<
    string,
    { name: string; url: string; type: string }
  >;

  public static dupReload: boolean;
  private static resQueue: Array<{
    key: string;
    url: string;
  }>;
  public static errorCountMap: Map<string, number>;
  //当网络异常后  最多重新加载3次
  public static errorReloadCount: number = 3;
  private static cbDict: Map<string, Array<Function | undefined>>;
  // 加载完成后  下一帧回调
  static asyncCallbackArr: Array<Function> = new Array();

  private static resMap: Map<
    string,
    { name: string; url: string; type: string; paramData?: any }
  > = new Map();

  private static isResInfoEqual(
    name: string,
    url: string,
    type: string
  ): boolean {
    if (ResManager.resMap.has(name)) {
      let resInfo = ResManager.getResInfo(name);
      let oldUrl = resInfo?.url;
      let oldtype = resInfo?.type;
      if (TextUtils.trim(oldtype) != TextUtils.trim(type) || !oldUrl) {
        return false;
      }
      // console.log("dsakjdhjasdjas","进入",name,oldUrl,url);
      oldUrl = ResManager.wipeRelativePath(ResManager.wipeParam(oldUrl));
      url = ResManager.wipeRelativePath(ResManager.wipeParam(url));
      if (
        oldUrl ==
        url
      ) {
        // console.log("dsakjdhjasdjas","相等",name,oldUrl,url);
        return true;
      }
    }
    return false;
  }

  private static wipeRelativePath(path: string): string {
    if (path.indexOf("./") != 0) {
      return path;
    }
    return ResManager.wipeRelativePath(path.substring(2, path.length));
  }

  public static wipeParam(path: string): string {
    if (path.indexOf("?") == -1) {
      return path;
    }
    return ResManager.wipeRelativePath(path.substring(0, path.indexOf("?")));
  }

  static putResInfo(name: string, url: string, type: string, param?: any) {
    if (ResManager.resMap.has(name) && !ResManager.isResInfoEqual(name, url, type)) {
      let resInfo = ResManager.getResInfo(name);
      throw new Error(
        `资源：${name}，已经配置过，无法重复配置，请检查资源重复！\n上一个资源url:${resInfo?.url}\n上一个资源type:${resInfo?.type}\n当前资源url:${url}\n当前资源type:${type}`
      );
    }
    let paramData: any = {};
    for (let key in param) {
      if (key != "url" && key != "type") {
        paramData[key] = param[key];
      }
    }
    ResManager.resMap.set(name, { name, url, type, paramData });
  }
  static hasResInfo(name: string): boolean {
    return ResManager.resMap.has(name);
  }

  static getResInfo(
    name: string
  ): { name: string; url: string; type: string; paramData?: any } | undefined {
    let obj = ResManager.resMap.get(name);
    !obj && Log.warn(`没有配置过【${name}】的资源，无法加载此资源，请检查！`);
    return obj;
  }

  static init() {
    ResManager.resLoader = new PIXI.Loader();
    ResManager.idle = true;
    ResManager.resources = {};
    ResManager.resourcesToDelete = [];
    ResManager.assetsAll = new Map();
    ResManager.errorCountMap = new Map();
    ResManager.resQueue = new Array();
    ResManager.cbDict = new Map<string, Array<Function | undefined>>();
    ResManager.resLoader.onComplete.add(ResManager.onComplete);
    ResManager.resLoader.onProgress.add(ResManager.onProcessPerFile);

    ResManager.dupReload = true;
  }

  /**
   * 加载异常的资源
   *
   * 如果不填写资源名  加载全部的异常资源
   * @param res 资源名
   */
  public static loadErrorRes(res?: string) {
    if (res == undefined) {
      ResManager.errorCountMap.forEach((count, name) => {
        if (count > ResManager.errorReloadCount) {
          let type = ResManager.assetsAll.get(name);
          if (type) {
            ResManager.removeResource(name);
            ResManager.errorCountMap.set(name, 0);
            ResManager.resQueue.push({ key: name, url: type.url });
          }
        }
      });
    } else {
      let count = ResManager.errorCountMap.get(res);
      if (count == undefined || count <= ResManager.errorReloadCount) {
        return;
      }
      let type = ResManager.assetsAll.get(res);
      if (type) {
        ResManager.removeResource(res);
        ResManager.errorCountMap.set(res, 0);
        ResManager.resQueue.push({ key: res, url: type.url });
      }
    }
  }

  /**
   * 异步队列加载，把需要加载的资源放到队列里
   * @param key
   * @param url
   * @param type
   * @param cb
   */
  static asyncLoad(key: string, url: string, type: string, cb?: Function) {
    ResManager.putResInfo(key, url, type);
    if (ResManager.resources[key] != undefined) {
      if (!ResManager.dupReload) {
        Log.warn("ResManager: Duplicate res:" + key + " async reload.");
      } else {
        Log.warn("ResManager: Duplicate res:" + key + "async load failed.");
        return;
      }
    }
    if (ResManager.noLoadingType.includes(type)) {
      cb && cb();
      return;
    }
    // console.warn("加载",key,ResManager.cbDict.has(key));
    if (ResManager.cbDict.has(key)) {
      let arr = ResManager.cbDict.get(key);
      arr?.push(cb);
      return;
    } else {
      ResManager.cbDict.set(key, [cb]);
    }
    ResManager.resQueue.push({ key, url });
    ResManager.assetsAll.set(key, { name: key, url, type });
  }
  /**
   * 删除销毁所有资源
   */
  static removeAllResources() {
    for (const key in ResManager.resources) {
      ResManager.resourcesToDelete.push(key);
    }
  }
  /**
   * 从WebGL内存中释放纹理，而不会破坏该纹理对象。这意味着您以后仍然可以使用纹理，它将再次将其上传到GPU内存。
   * @param nick 要释放的Texture的资源昵称
   */
  static dispose(nick: string) {
    let res = ResManager.resources[nick];
    if (res == undefined) {
      Log.warn("ResManager: dispose failed. Cannot find res:" + nick);
      return;
    }
    if (ResManager.getResInfo(nick)?.type == "spine") {
      res = ResManager.resources[nick];
      for (let index = 0; index < res.spineAtlas.pages.length; index++) {
        var element = res.spineAtlas.pages[index];
        var d = nick + "_atlas_page_" + element.name;
        let page = ResManager.resources[d];
        page &&
          page.texture &&
          page.texture.baseTexture &&
          page.texture.baseTexture.dispose &&
          page.texture.baseTexture.dispose();
      }
    } else if (ResManager.getResInfo(nick)?.type == "image") {
      res.texture &&
        res.texture.baseTexture &&
        res.texture.baseTexture.dispose &&
        res.texture.baseTexture.dispose();
    }
  }

  /**
   * 从资源缓存里删除销毁资源
   * @param key
   */
  static asyncRemoveResource(key: string) {
    ResManager.resourcesToDelete.push(key);
  }
  public static removeResource(key: string) {
    if (!this.isExist(key)) {
      return;
    }
    // console.log("删除",key);
    let res = ResManager.getRes(key);
    if (Array.isArray(ResManager.resources[key].children)) {
      ResManager.resources[key].children.forEach((v) => {
        ResManager.removeResource(v.name);
      });
      // console.log("删除",ResManager.resources[key].children)
      ResManager.resources[key].children.clear();
    }
    if ((<any>ResManager.resources[key])._clearEvents) {
      (<any>ResManager.resources[key])._clearEvents();
    }
    if (ResManager.getResInfo(key)?.type == "spine") {
      //清除spine的  依赖资源
      res = ResManager.resources[key];
      let altasName = key + "_atlas";
      for (let index = 0; index < res.spineAtlas.pages.length; index++) {
        var element = res.spineAtlas.pages[index];
        var d = key + "_atlas_page_" + element.name;
        ResManager.removeResource(d);
      }
      ResManager.removeResource(altasName);
      delete ResManager.resources[key];
    } else if (ResManager.getResInfo(key)?.type == "audio") {
      if (ResManager.resources[key]) {
        (<any>ResManager.resources[key]).audio = undefined;
        (<any>ResManager.resources[key]).data = undefined;
        (<any>ResManager.resources[key]).xhr = null;
      }
      AudioManager.destroy(key);
      delete ResManager.resources[key];
    } else {
      if (ResManager.getResInfo(key)?.type == "image") {
        //解决spine的内存泄漏
        if (res) {
          PIXI.Texture.removeFromCache(res);
          PIXI.BaseTexture.removeFromCache(res);
        }

        let removeTexture = PIXI.Texture.removeFromCache(key);
        let removeBaseTexture = PIXI.BaseTexture.removeFromCache(key);
        removeTexture?.destroy(true);
        removeBaseTexture?.destroy();
        if (res.url != undefined) {
          removeTexture = PIXI.Texture.removeFromCache(res.url);
          removeBaseTexture = PIXI.BaseTexture.removeFromCache(res.url);
          removeTexture?.destroy(true);
          removeBaseTexture?.destroy();
        }
        if (ResManager.resources[key].texture) {
          ResManager.resources[key].texture.destroy(true);
          (<any>ResManager.resources[key]).texture = undefined;
        }
        // console.log("sadasdasdas",ResManager.resources[key].textures)
        delete ResManager.resources[key].textures;
      }
      res?.destroy && res.destroy(true);
      delete ResManager.resources[key];
    }
  }

  /**
   * 正在加载，队列里的单个资源加载结束
   * 加载进度
   * @param loader
   * @param resource
   */
  static onProcessPerFile(loader: PIXI.Loader, resource: PIXI.LoaderResource) {
    if (resource.isComplete) {
      let key = resource.name;
      //如果不是自己的res配置则不进行解析，如spine里的配置资源。
      if(!ResManager.hasResInfo(key)){ return; }
      if (!resource.error) {
        let typeObg = ResManager.getResInfo(key);
        if (typeObg && !(<any>resource)[LoadType[typeObg.type]]) {
          resource.error = new Error(
            `${typeObg.type}加载异常！，资源名：${key}，类型：${typeObg.type}`
          );
        }
        if (typeObg?.type == "spine") {
          //spine   子节点报错
          let error = undefined;
          if (Array.isArray(resource.children)) {
            resource.children.forEach((v) => {
              // console.log("spine 子节点：",v.data,v);
              if (v.error) {
                error = v.error;
              }
            });
          }
          if (error) {
            resource.error = error;
            //移除spine的缓存资源
            resource.children.forEach((v) => {
              let removeTexture = PIXI.Texture.removeFromCache(v.name);
              let removeBaseTexture = PIXI.BaseTexture.removeFromCache(v.name);
              if (removeTexture && removeTexture.destroy) {
                removeTexture.destroy(true);
              }
              if (removeBaseTexture && removeBaseTexture.destroy) {
                removeBaseTexture.destroy();
              }
              if (v.url != undefined) {
                removeTexture = PIXI.Texture.removeFromCache(v.url);
                removeBaseTexture = PIXI.BaseTexture.removeFromCache(v.url);
                if (removeTexture && removeTexture.destroy) {
                  removeTexture.destroy(true);
                }
                if (removeBaseTexture && removeBaseTexture.destroy) {
                  removeBaseTexture.destroy();
                }
              }
              (<any>loader.resources)[v.name] = undefined;
              delete loader.resources[v.name];
            });
            (<any>loader.resources)[resource.name] = undefined;
            delete loader.resources[resource.name];
          }
        }
      }

      if (resource.error) {
        //出异常
        let count = ResManager.errorCountMap.get(key);
        if (count == undefined) {
          count = 0;
        }
        count++;
        ResManager.errorCountMap.set(key, count);
        if (count > ResManager.errorReloadCount) {
          let err = new Error(
            `加载资源异常:资源名【${key}】\n资源路径【${resource.url}】\n ${resource.error.message}`
          );
          if (EventManager.eventIncludes(EventManager.LOADING_ERROR)) {
            console.error(err);
            let isSendErrorEvent = true;
            ResManager.errorCountMap.forEach((count, name) => {
              if (count <= ResManager.errorReloadCount) {
                isSendErrorEvent = false;
              }
            });
            if (isSendErrorEvent) {
              let arr = new Array();
              ResManager.errorCountMap.forEach((count, name) => {
                arr.push({ name, err });
              });
              ResManager.resLoader.reset();
              ResManager.idle = true;
              EventManager.emit(EventManager.LOADING_ERROR, arr);
            }
            return;
          }
          throw err;
        }
        Log.warn(
          `加载资源异常:资源名【${key}】,重新加载次数【${count}】,资源路径【${resource.url}】`
        );
        ResManager.resQueue.push({ key, url: resource.url });
        return;
      }
      ResManager.errorCountMap.delete(key);
      ResManager.resources[key] = resource;
      let arr = ResManager.cbDict.get(key);
      if (Array.isArray(arr)) {
        arr.forEach((cb) => {
          if (cb) {
            cb && cb();
          }
        });
        ResManager.cbDict.delete(key);
      }
    } else {
      Log.warn("ResManager: Load failed. res:" + resource.name);
    }
  }

  /**
   * 加载结束
   */
  static onComplete() {
    for (let key in ResManager.resLoader.resources) {
      let res = ResManager.resLoader.resources[key];
      if (!ResManager.hasResInfo(res.name)) {
        let type = ExtensionType[res.extension];
        if (type == undefined) {
          type = "data";
        }
        ResManager.putResInfo(res.name, res.url, type);
      }
      if (ResManager.hasResInfo(res.name)) {
        let typeObj = ResManager.getResInfo(res.name);
        if (typeObj && LoadType[typeObj.type] !== "data") {
          res.data = null;
        }
      }

      res.xhr = null;
    }
    ResManager.resLoader.reset();
    ResManager.idle = true;
    if (ResManager.asyncCallbackArr.length > 0) {
      ResManager.asyncCallbackArr.length = 0;
    }
  }
  static isExist(name?: string) {
    if (name == undefined) {
      return false;
    }
    return !!ResManager.resources[name];
  }
  /**
   * 一个一直在循环检测资源队列，进行加载
   * @param dt
   */
  static update(dt: number) {
    if (ResManager.idle && ResManager.resQueue.length > 0) {
      while (ResManager.resQueue.length > 0) {
        let res = ResManager.resQueue.shift();
        if (res) {
          if (ResManager.resourcesToDelete.indexOf(res?.key) != -1) {
            ResManager.resourcesToDelete.remove(res?.key);
          }
          if (!ResManager.isExist(res?.key)) {
            ResManager.resLoader.add(res?.key, res?.url);
          }
        }
      }
      for (let i = 0; i < ResManager.resourcesToDelete.length; i++) {
        let key = ResManager.resourcesToDelete[i];
        if (ResManager.resources[key]) {
          ResManager.removeResource(key);
          ResManager.resourcesToDelete.remove(key);
          i--;
        }
      }
      ResManager.idle = false;
      ResManager.resLoader.load();
    }
  }
  /**
   * 如果资源已存在则不会再次加载
   * @param name
   * @param url
   * @param type
   * @param callback
   */
  static loadRes(name: string, url: string, type: string, callback: Function) {
    let resources: any = ResManager.resources[name];
    if (ResManager.isExist(name)) {
      callback && callback();
      return;
    }
    ResManager.asyncLoad(name, url, type, callback);
  }
  /**
   * 加载多个资源，如果资源已存在则不会再次加载
   * @param res
   * @param onProcess
   * @param onComplete
   */
  static loadResArr(
    res: Array<{ name: string; url: string; type: string }>,
    onProcess?: Function,
    onComplete?: Function
  ) {
    if (res.length == 0) {
      onProcess && onProcess(0, 0);
      onComplete && onComplete();
      return;
    }
    let count = res.length;
    let index = 0;
    res.forEach((item) => {
      ResManager.loadRes(item.name, item.url, item.type, () => {
        index++;
        onProcess && onProcess(index, count, item.name);
        if (index == count) {
          onComplete && onComplete();
        }
      });
    });
  }
  /**
   * 获取缓存内已存在的资源
   * @param name
   */
  static getRes(name: string): any | PIXI.Texture {
    if (TextUtils.isEmpty(name)) {
      return undefined;
    }
    let resources: any = ResManager.resources[name];
    if (!resources) {
      throw new Error("没有找到名叫【" + name + "】的资源！");
    }
    let resKey = ResManager.assetsAll.get(name);
    if (!resKey || !LoadType[resKey.type]) {
      Log.warn("警告！！！，未找到对应类型的资源！！", resKey?.type, name);
      return resources;
    }
    resources = resources[LoadType[resKey.type]];
    if (
      typeof resources == "object" &&
      (resKey.type == "spine" || resKey.type == "image")
    ) {
      resources["name"] = name;
    }

    if (!resources) {
      Log.warn(
        `warn: type:${resKey.type} \n url:${resKey.url}\n  ${name} is null or undefined!!!`
      );
    }
    return resources;
  }
}
