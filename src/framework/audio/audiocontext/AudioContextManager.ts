import { ResManager } from "../../core/ResManager";
import { Log } from "../../log/Log";
import { LoaderResource } from "pixi.js";
import { AudioInterface } from "../interface/AudioInterface";
import { AudioLoader } from "../loader/AudioLoader";
import { MyAudioContext } from "./MyAudioContext";
import { AudioManagerInterface } from "../interface/AudioManagerInterface";
import { ErrorPlugInterface } from "../interface/ErrorPlugInterface";

const win = window as any;
win.AudioContext =
  win.AudioContext ||
  win.webkitAudioContext ||
  win.mozAudioContext ||
  win.msAudioContext;

export class AudioContextManager implements AudioManagerInterface {
  private mAudioMap: Map<string, Array<MyAudioContext>> = new Map();
  private loadMap: Map<
    string,
    Array<{
      callback?: (buffer: AudioBuffer) => void;
      errorCallback?: (e: DOMException) => void;
    }>
  > = new Map();
  private mAudioBufferMap: Map<string, AudioBuffer> = new Map();
  private _globalVolume: number = 1;
  private _globalSpeed: number = 1;
  private _globalMuted: boolean = false;
  isGlobalPause: boolean = false;
  isOffsetPause: boolean = false;
  protected static instance: AudioContextManager;
  public static mApplicationAudioContext = new window.AudioContext();
  private static _errorPlug:ErrorPlugInterface|undefined;

  public static errorPlug(plug:ErrorPlugInterface|undefined){
    AudioContextManager._errorPlug = plug;
  }

  private constructor() {}
  public static getInstance() {
    if (!this.instance) {
      this.instance = new AudioContextManager();
    }
    AudioLoader.suffix.forEach((v) => {
      (<any>LoaderResource)._loadTypeMap[v] = LoaderResource.LOAD_TYPE.XHR;
    });
    return this.instance;
  }

  public getAudioArr():Array<AudioInterface>{
    let arr = new Array();
    this.mAudioMap.forEach(v=>v.forEach(a=>arr.push(a)))
    return arr;
  }
  public getBufferArr():Array<AudioBuffer>{
    let arr = new Array();
    this.mAudioBufferMap.forEach(a=>arr.push(a))
    return arr;
  }

  /**
   * 全局音量
   */
  public set globalVolume(globalVolume: number) {
    this._globalVolume = globalVolume;
    this.mAudioMap.forEach((v) => {
      v.forEach((audio) => {
        audio.volume = audio.volume;
      });
    });
  }
  public get globalVolume(): number {
    return this._globalVolume;
  }
  /**
   * 全局速度
   */
  public set globalSpeed(globalSpeed: number) {
    this._globalSpeed = globalSpeed;
    this.mAudioMap.forEach((v) => {
      v.forEach((audio) => {
        audio.speed = audio.speed;
      });
    });
  }
  public get globalSpeed(): number {
    return this._globalSpeed;
  }

  /**
   * 全局静音
   */
  public set globalMuted(globalMuted: boolean) {
    this._globalMuted = globalMuted;
    this.mAudioMap.forEach((v) => {
      v.forEach((audio) => {
        audio.muted = audio.muted;
      });
    });
  }
  public get globalMuted(): boolean {
    return this._globalMuted;
  }

  public update(dt: number) {
    this.mAudioMap.forEach((v) => {
      v.forEach((a) => a.update(dt));
    });
  }
  /**
   * 使所有播放声音静音。
   */
  public muteAll() {
    this.globalMuted = true;
  }
  /**
   * 使所有播放声音静音恢复。
   */
  public unmuteAll() {
    this.globalMuted = false;
  }

  /**
   * 暂停任何播放声音。
   */
  public pauseAll() {
    if (this.isOffsetPause) {
      return;
    }
    this.isOffsetPause = true;
    this.mAudioMap.forEach((v) => {
      v.forEach((audio) => {
        audio._globalPause();
      });
    });
  }
  /**
   * 恢复任何播放声音。
   */
  public resumeAll() {
    if (!this.isOffsetPause) {
      return;
    }
    this.isOffsetPause = false;
    this.mAudioMap.forEach((v) => {
      v.forEach((audio) => {
        audio._globalResume();
      });
    });
  }
  /**
   * 暂停任何播放声音。
   */
  public globalPause() {
    if (this.isGlobalPause) {
      return;
    }
    this.isGlobalPause = true;
    this.mAudioMap.forEach((v) => {
      v.forEach((audio) => {
        audio._globalPause();
      });
    });
  }
  /**
   * 恢复任何播放声音。
   */
  public globalResume() {
    if (!this.isGlobalPause) {
      return;
    }
    this.isGlobalPause = false;
    this.mAudioMap.forEach((v) => {
      v.forEach((audio) => {
        audio._globalResume();
      });
    });
  }
  /**
   * 播放音乐
   * @param alias
   */
  public play(alias: string): MyAudioContext {
    let audios = this.getAudiosByAlias(alias);
    if (!Array.isArray(audios) || audios.length == 0) {
      if (!ResManager.isExist(alias)) {
        let a = this.getAlias();
        Log.info(
          "目前已存在的资源:",
          a,
          a.includes(alias),
          ResManager.isExist(alias)
        );
        let isThrow = true;

        let e = new Error(`资源：${alias} 未加载在内存中，无法播放！`);
        if(AudioContextManager._errorPlug?.memoryNotFound){
          isThrow = false;
          AudioContextManager._errorPlug.memoryNotFound(alias,e);
        }
        if(AudioContextManager._errorPlug?.error){
          isThrow = false;
          AudioContextManager._errorPlug.error(alias,e);
        }
        if(isThrow){
          throw e;
        }
      }
      let audio = new MyAudioContext(alias, ResManager.resources[alias]);
      audio = audio.clone();
      let buffer = this.getAudioBuffer(alias);
      if(!buffer){
        if(!ResManager.resources[alias]){
          throw new Error(`资源：${alias} 未加载在内存中，无法播放！`);
        }
        this.loadAudioBuffer(ResManager.resources[alias],()=>{
          audio.play();
        });
      }else{
        audio.play();
      }
      return audio;
    }
    let audio = audios[0];
    audio = audio.clone();
    audio.play();
    return audio;
  }

  public getAlias(): Array<string> {
    let arr = new Array();
    this.mAudioMap.forEach((v, k) => {
      arr.push(k);
    });
    return arr;
  }

  /**
   * 检查别名是否存在声音。
   */
  public exists(alias: string): boolean {
    let audios = this.getAudiosByAlias(alias);
    return Array.isArray(audios) && audios.length !== 0;
  }
  /**
   * 添加音频信息
   * @param alias 别名
   * @param audio 音频
   */
  public pushAudio(alias: string, audio: MyAudioContext) {
    let array = this.getAudiosByAlias(alias);
    if (!Array.isArray(array)) {
      array = new Array();
      this.mAudioMap.set(alias, array);
    }
    if (!array.includes(audio)) {
      array.push(audio);
    }
  }

  public setAudioBuffer(alias: string, buffer: AudioBuffer) {
    this.mAudioBufferMap.set(alias, buffer);
  }

  public getAudioBuffer(alias: string): AudioBuffer | undefined {
    return this.mAudioBufferMap.get(alias);
  }

  public isAudioBufferExist(alias: string): boolean {
    return !!this.mAudioBufferMap.get(alias);
  }

  /**
   * 通过别名  获取音频组
   * @param alias 别名
   */
  public getAudiosByAlias(alias: string): Array<MyAudioContext> | undefined {
    return this.mAudioMap.get(alias);
  }

  /**
   * 获取一个被释放的音频
   * @param alias
   */
  public pop(alias: string): MyAudioContext | undefined {
    let audios = this.getAudiosByAlias(alias);
    if (!Array.isArray(audios)) {
      return;
    }
    for (let i = 0; i < audios.length; i++) {
      if (audios[i].isRelease && !audios[i].isDestroy) {
        return audios[i];
      }
    }
    return;
  }

  /**
   * 销毁别名的资源
   * @param alias
   */
  public destroyAlias(alias: string) {
    let audios = this.getAudiosByAlias(alias);
    if (Array.isArray(audios)) {
      for (let i = 0; i < audios.length; i++) {
        audios[i].destroy();
        i--;
      }
    }
    this.mAudioBufferMap.delete(alias);
  }
  /**
   * 停止并删除所有声音。此后将无法使用它们。
   */
  public destroyAll() {
    this.mAudioMap.forEach((v, k) => {
      this.destroyAlias(k);
    });
    this.mAudioBufferMap.clear();
  }

  /**
   * 释放音频资源
   * @param alias
   */
  public release(alias: string) {
    let audios = this.getAudiosByAlias(alias);
    if (Array.isArray(audios)) {
      for (let i = 0; i < audios.length; i++) {
        audios[i].release();
      }
    }
  }
  /**
   * 释放全部
   */
  public releaseAll() {
    this.mAudioMap.forEach((v, k) => {
      this.release(k);
    });
  }

  /**
   * 停止所有声音。
   */
  public stopAll() {
    this.mAudioMap.forEach((v, k) => {
      v.forEach((audio) => {
        audio.stop();
      });
    });
  }

  /**
   * 删除  音频
   * @param alias 从哪个别名组里删除
   * @param audio 要删除的资源
   * @param find 是否彻底查找删除（会忽略别名组）
   */
  public removeAudio(
    alias: string | undefined,
    audio: MyAudioContext,
    find: boolean = false
  ): boolean {
    let audios;
    if (alias != undefined) {
      audios = this.getAudiosByAlias(alias);
    }
    let isRemove = false;
    if (!find) {
      if (Array.isArray(audios)) {
        isRemove = this.removeArray(audios, audio);
        if (audios.length == 0 && alias != undefined) {
          this.mAudioMap.delete(alias);
          this.mAudioBufferMap.delete(alias);
          let resInfo = ResManager.getResInfo(alias);
          // console.log("销毁", alias);
          if (resInfo?.type == "audio" && ResManager.resources[alias]) {
            (<any>ResManager.resources[alias]).audio = undefined;
            (<any>ResManager.resources[alias]).data = undefined;
            (<any>ResManager.resources[alias]).xhr = null;
            delete ResManager.resources[alias];
          }
        }
        return isRemove;
      }
    } else {
      this.mAudioMap.forEach((audios, k) => {
        if (this.removeArray(audios, audio)) {
          if (audios.length == 0) {
            this.mAudioMap.delete(k);
            this.mAudioBufferMap.delete(k);
            let resInfo = ResManager.getResInfo(k);
            if (resInfo?.type == "audio" && ResManager.resources[k]) {
              (<any>ResManager.resources[k]).audio = undefined;
              (<any>ResManager.resources[k]).data = undefined;
              (<any>ResManager.resources[k]).xhr = null;
              delete ResManager.resources[k];
            }
          }
          isRemove = true;
        }
      });
    }
    return isRemove;
  }

  /**
   * 删除数组
   * @param audios
   * @param audio
   */
  private removeArray(
    audios: Array<MyAudioContext>,
    audio: MyAudioContext
  ): boolean {
    for (let i = 0; i < audios.length; i++) {
      if (audios[i] == audio) {
        audios.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  loadAudioBuffer(
    resource: LoaderResource,
    callback?: (buffer: AudioBuffer) => void,
    errorCallback?: (e: DOMException) => void
  ) {
    let alias = resource.name;

    let buffer = AudioContextManager.getInstance().getAudioBuffer(alias);
    if (buffer) {
      callback && callback(buffer);
      return;
    }
    let arr = this.loadMap.get(alias);
    if (Array.isArray(arr)) {
      arr.push({
        callback,
        errorCallback,
      });
      return;
    }

    arr = new Array();
    this.loadMap.set(alias, arr);
    arr.push({
      callback,
      errorCallback,
    });
    
    AudioContextManager.mApplicationAudioContext.decodeAudioData(
      resource.data,
      function (buffer: AudioBuffer) {
        AudioContextManager.getInstance().setAudioBuffer(alias, buffer);
        let arr = AudioContextManager.getInstance().loadMap.get(alias);
        if (Array.isArray(arr)) {
          arr.forEach((v) => {
            v.callback && v.callback(buffer);
          });
          arr.clear();
        }
        AudioContextManager.getInstance().loadMap.delete(alias);
      },
      function (e: DOMException) {
        //解码出错时的回调函数
        let arr = AudioContextManager.getInstance().loadMap.get(alias);
        if (Array.isArray(arr)) {
          arr.forEach((v) => {
            v.errorCallback && v.errorCallback(e);
          });
          arr.clear();
        }
        AudioContextManager.getInstance().loadMap.delete(alias);
      }
    );
  }

  loadAudio(resource: LoaderResource, callback: () => void) {
    let audio = new MyAudioContext(resource.name, resource);
    audio.isRelease = true;
    // (<any>resource).audio = audio;
    let errorCallback = (err: Error) => {
      audio.off(MyAudioContext.EVENTS.ERROR, errorCallback);
      let str = "";
      if (err) {
        str = err.toString();
      }
      resource.error = new Error("资源加载出错！！！" + str);
      callback();
    };
    audio.on(MyAudioContext.EVENTS.ERROR, errorCallback);
    audio.load(() => {
      callback();
    });
  }
}
