import { ResManager } from "../core/ResManager";
import { AudioLoader } from "./loader/AudioLoader";
import { HTMLAudioManager } from "./html/HTMLAudioManager";
import { AudioInterface } from "./interface/AudioInterface";
import { AudioGroupManager } from "./AudioGroupManager";
import { AudioManagerInterface } from "./interface/AudioManagerInterface";
import { AudioType } from "./AudioType";
import { AudioContextManager } from "./audiocontext/AudioContextManager";
import { LoaderResource } from "pixi.js";
import { ErrorPlugInterface } from "./interface/ErrorPlugInterface";


export class AudioManager {
  public static mAM: AudioManagerInterface;
  private static _useAudioType: AudioType;
  private static isUpdate: boolean = false;

  public static set globalVolume(volume: number) {
    this.mAM.globalVolume = volume;
  }
  public static get globalVolume(): number {
    return this.mAM.globalVolume;
  }

  public static get isGlobalPause(): boolean {
    return this.mAM.isGlobalPause;
  }
  public static get isOffsetPause(): boolean {
    return this.mAM.isOffsetPause;
  }
  private static _errorPlug:ErrorPlugInterface|undefined;
  public static errorPlug(plug:ErrorPlugInterface|undefined){
    AudioManager._errorPlug = plug;
    if(this.useAudioType == AudioType.HTML){
      HTMLAudioManager.errorPlug(plug);
    }else{
      AudioContextManager.errorPlug(plug);
    }
  }
  
  /**
   * 是否使用htmlaudio
   */
  public static set useAudioType(type: AudioType) {
    if (this.useAudioType == type) {
      return;
    }
    this._useAudioType = type;
    this.mAM = this.getAudioManager();
    AudioGroupManager.init(type);
    AudioManager.errorPlug(AudioManager._errorPlug);
  }
  public static get useAudioType(): AudioType {
    return this._useAudioType;
  }

  private static getAudioManager(): AudioManagerInterface {
    switch (this.useAudioType) {
      case AudioType.AUDIO_CONTEXT:
        return AudioContextManager.getInstance();
      case AudioType.HTML:
        return HTMLAudioManager.getInstance();
    }
  }
  /**
   * 要想使用声音，需要调用此函数初始化
   */
  public static init() {
    this.useAudioType = AudioType.AUDIO_CONTEXT;
    ResManager.resLoader.use(AudioLoader.use);
    if (!AudioManager.isUpdate) {
      PIXI.Ticker.shared.add(AudioManager.update);
      AudioManager.isUpdate = true;
    }
  }

  private static update(){
    AudioManager.mAM.update(PIXI.Ticker.shared.deltaMS);
  }

  /**
   * 设置所有声音的全局速度。
   */
  public static set globalSpeed(globalSpeed: number) {
    this.mAM.globalSpeed = globalSpeed;
  }
  public static get globalSpeed(): number {
    return this.mAM.globalSpeed;
  }

  /**
   * 使所有播放声音静音。
   */
  public static muteAll() {
    this.mAM.muteAll();
  }
  /**
   * 使所有播放声音静音恢复。
   */
  public static unmuteAll() {
    this.mAM.unmuteAll();
  }
  /**
   * 暂停任何播放声音。
   */
  public static pauseAll() {
    this.mAM.pauseAll();
  }
  /**
   * 恢复任何播放声音。
   */
  public static resumeAll() {
    this.mAM.resumeAll();
  }

  /**
   * 暂停任何播放声音。
   */
  public static globalPause() {
    this.mAM.globalPause();
  }
  /**
   * 恢复任何播放声音。
   */
  public static globalResume() {
    this.mAM.globalResume();
  }

  /**
   * 播放声音
   * @param alias
   */
  public static play(alias: string): AudioInterface {
    return this.mAM.play(alias);
  }

  /**
   * 检查别名是否存在声音。
   */
  public static exists(alias: string): boolean {
    return this.mAM.exists(alias);
  }
  /**
   * 释放音频资源
   */
  public static release(alias: string) {
    this.mAM.release(alias);
  }
  /**
   * 释放全部
   */
  public static releaseAll() {
    this.mAM.releaseAll();
  }
  /**
   * 停止所有声音。
   */
  public static stopAll() {
    this.mAM.stopAll();
  }

  public static destroy(alias: string) {
    this.mAM.destroyAlias(alias);
  }
  public static destroyAll() {
    this.mAM.destroyAll();
  }
  public static loadAudio(resource: LoaderResource,callback:()=>void){
    this.mAM.loadAudio(resource,callback);
  }
}
