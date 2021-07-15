import { Component } from "../core/Component";
import { ResManager } from "../core/ResManager";
import { TweenManager } from "../tween/TweenManager";
import { Tween } from "../tween/Tween";
import { Log } from "../log/Log";
import { AudioManager } from "./AudioManager";
import { HTMLAudio } from "./html/HTMLAudio";
export class AudioComponent extends Component {
  public static END: string = "end";
  public static PLAY: string = "play";
  public static PROGRESS: string = "progress";
  /**
   * 事件
   */
  public static EVENTS = HTMLAudio.EVENTS;
  public nick: string = "";
  public destroyAudio: boolean = false;
  public index = 0;
  public count = 0;
  private audioSource: HTMLAudio;
  private isPlayingActive: boolean = false;
  private _offsetVolume: number = 1;
  private _aminVolume: number = 1;
  private _offsetMuted: boolean = false;
  private _muted: boolean = false;
  private _volume: number = 1;
  public audioSourceName: string;
  private tweenVolume: Tween | undefined;
  instance: any;
  private _globalVolume: number = 1;
  private _globalSpeed: number = 1;
  private _speed: number = 1;
  private _globalMuted: boolean = false;
  isPause: boolean = false;
  isGlobalPause: boolean = false;
  constructor(name: string) {
    super();
    this.audioSourceName = name;
    this.audioSource = <any>AudioManager.play(name);
  }
  get active(): boolean {
    return this._active;
  }
  /**
   * 设置激活状态
   */
  set active(active: boolean) {
    this._active = active;
    if (active) {
      if (this.isPlayingActive) {
        this.resume();
      }
    } else {
      this.isPlayingActive = this.isPlaying;
      this.pause();
    }
    active ? this.activated() : this.deactivated();
  }
  get isPlaying(): boolean {

    //TODO
    return false;
  }

  /**
   * 全局音量
   */
  set globalVolume(volume: number) {
    this._globalVolume = volume;
    this.volume = this.volume;
  }
  get globalVolume(): number {
    return this._globalVolume;
  }
  /**
   * 偏移音量
   */
  set offsetVolume(volume: number) {
    this._offsetVolume = volume;
    this.volume = this.volume;
  }
  get offsetVolume(): number {
    return this._offsetVolume;
  }

  /**
   * 声音渐变动画的音量
   */
  set aminVolume(volume: number) {
    this._aminVolume = volume;
    this.volume = this.volume;
  }
  get aminVolume(): number {
    return this._aminVolume;
  }

  /**
   * 音量
   */
  set volume(volume: number) {
    this._volume = volume;
    let v =
      this._volume * this.offsetVolume * this.aminVolume * this.globalVolume;
    // if(!isFinite(v)){
    //   throw new Error(`isFinite 当前${v},_volume:${volume},offsetVolume:${this.offsetVolume},aminVolume:${this.aminVolume},globalVolume:${this.globalVolume}`);
    // }
    // if(isNaN(v)){
    //   throw new Error(`isNaN 当前${v},_volume:${volume},offsetVolume:${this.offsetVolume},aminVolume:${this.aminVolume},globalVolume:${this.globalVolume}`);
    // }
    this.audioSource.volume = v;
  }
  get volume(): number {
    return this._volume;
  }

  /**
   * 全局静音
   */
  set globalMuted(muted: boolean) {
    this._globalMuted = muted;
    this.muted = this.muted;
  }
  get globalMuted(): boolean {
    return this._globalMuted;
  }

  /**
   * 偏移静音
   */
  set offsetMuted(muted: boolean) {
    this._offsetMuted = muted;
    this.muted = this.muted;
  }
  get offsetMuted(): boolean {
    return this._offsetMuted;
  }

  /**
   * 静音
   */
  set muted(muted: boolean) {
    this.audioSource.muted = muted;
  }
  get muted(): boolean {
    return this._muted;
  }
  set loop(loop: boolean) {
    this.audioSource.loop = loop;
  }
  get loop(): boolean {
    return this.audioSource.loop;
  }
  /**
   * 当前速度
   */
  set speed(speed: number) {
    if (!this.instance) {
      return;
    }
    this.audioSource.speed = speed;
  }
  get speed(): number {
    return this.audioSource.speed;
  }


  play() {
    if (!this.active) {
      console.warn("当前音频未激活，无法播放！");
      return;
    }
    this.emit(AudioComponent.PLAY);
    this.globalVolume = AudioManager.globalVolume;
    this._globalSpeed = AudioManager.globalSpeed;
    this.isGlobalPause = AudioManager.isGlobalPause;
    // Log.info("------",this.audioSource)

   this.audioSource.play();
    this.speed = this.speed;
    this.preRause();
  }
  stop() {
    if (!this.instance) {
      return;
    }
    this.audioSource.stop();
    // AudioManager.removeAudio(this.componentId);
    // this.instance.speed = 15;
    // this.instance.volume = 0; 
    // this.instance.off(Con)
    // this.instance.stop();
    // Log.info("hehe",this.instance,this.audioSource);
    // this.instance.refresh();
    // this.instance.destroy();
    // let _instances = (<any>this.audioSource).instances;
    // if (Array.isArray(_instances)) {
    //   _instances.remove(this.instance);
    // }
    // Log.info("asdkljlkasjd",this.audioSource)
    this.instance = undefined;
    // this.instance.close();
  }
  /**
   * 暂停音乐
   */
  pause() {
    if (!this.isPlaying || !this.instance) {
      return;
    }
    this.isPause = true;
    this.preRause();
  }

  private preRause() {
    if (this.isPause || (this.isGlobalPause && this.instance)) {
      // Log.info("音乐速度：","pause",this.isGlobalPause,this.isPause,this.audioSource)
      // this.instance.paused = true;
      this.audioSource.pause();
      // this.instance.pause();
    }
  }
  private preResume() {
    if (!this.isGlobalPause && !this.isPause && this.instance) {
      // Log.info("音乐速度：","resume",this.isGlobalPause,this.isPause,this.audioSource)
      // this.instance.paused = false;
      this.audioSource.play();
      // this.instance.resume();
    }
  }
  /**
   * 全局暂停音乐
   */
  globalPause() {
    if (!this.isPlaying || !this.instance) {
      return;
    }
    this.isGlobalPause = true;
    this.preRause();
  }
  /**
   * 全局恢复
   */
  globalResume() {
    if (!this.isGlobalPause || !this.instance) {
      return;
    }
    if (!this.active) {
      console.warn("当前音频未激活，无法播放！");
      return;
    }
    this.isGlobalPause = false;
    this.preResume();
  }
  /**
   * 恢复音乐
   */
  resume() {
    if (this.isPlaying || !this.isPause || !this.instance) {
      return;
    }
    if (!this.active) {
      console.warn("当前音频未激活，无法播放！");
      return;
    }
    this.isPause = false;
    this.preResume();
  }
  fadeInVolume(time: number, callback?: Function) {
    this.fadeVolume(time, this.aminVolume, 1, callback);
  }
  fadeOutVolume(time: number, callback?: Function) {
    this.fadeVolume(time, this.aminVolume, 0, callback);
  }
  fadeToVolume(time: number, volume: number, callback?: Function) {
    this.fadeVolume(time, this.aminVolume, volume, callback);
  }
  fadeVolume(
    time: number,
    startVolume: number,
    endVolume: number,
    callback?: Function
  ) {
    if (this.tweenVolume) {
      Log.warn(
        "正在执行音乐的   fadeVolume 动画  无法重复执行  ，执行之前请先调用  stopVolume"
      );
      return;
    }
    this.tweenVolume = TweenManager.builder(this)
      .from({ aminVolume: startVolume })
      .to({ aminVolume: endVolume })
      .time(time)
      .setExpire(true)
      .on("end", () => {
        this.stopVolume();
        callback && callback();
      })
      .start();
  }
  stopVolume() {
    if (this.tweenVolume) {
      this.tweenVolume.stop();
      this.tweenVolume = undefined;
    }
  }
  removeEvents() {
    super.removeEvents();
    if (this.instance) {
      this.instance.off(AudioComponent.PLAY);
      this.instance.off(AudioComponent.END);
      this.instance.off(AudioComponent.PROGRESS);
    }
  }
  destroy(options?: {
    children?: boolean;
    texture?: boolean;
    baseTexture?: boolean;
  }) {
    let destroyAudio = !!options;
    if(this.isDestroy){
      return;
    }
    if (destroyAudio == undefined) {
      destroyAudio = this.destroyAudio;
    }
    // Log.info("音乐----",destroyAudio)
    if(this.instance){
      this.instance.off(AudioComponent.PLAY);
      this.instance.off(AudioComponent.END);
      this.instance.off(AudioComponent.PROGRESS);
    }
    this.stop();
    // this.instance.destroy();
    // AudioManager.removeAudio(this.componentId);
    this.instance = undefined;
    if (destroyAudio) {
      // this.audioSource.close();
      ResManager.removeResource(this.audioSourceName);
    }
    // this.audioSource = undefined;
    (<any>this).filtersProperty = [];
    super.destroy();
  }
}
