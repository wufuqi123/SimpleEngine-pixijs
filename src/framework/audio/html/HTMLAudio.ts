import { Log } from "../../log/Log";
import { EventEmitter } from "eventemitter3";
import { HTMLAudioManager } from "./HTMLAudioManager";
import { TweenManager } from "../../tween/TweenManager";
import { Tween } from "../../tween/Tween";
import { HTMLAudioGroupManager } from "./HTMLAudioGroupManager";
import { AudioInterface } from "../interface/AudioInterface";
export class HTMLAudio extends EventEmitter implements AudioInterface {
  public static EVENTS = {
    /**
     * 客户端开始请求数据
     */
    LOAD_START: "loadstart",

    /**
     * 客户端正在请求数据
     */
    PROGRESS: "progress",
    /**
     * 延迟下载
     */
    SUSPEND: "suspend",
    /**
     * 客户端主动终止下载(不是因为错误引起)
     */
    ABORT: "abort",
    /**
     * 请求数据时遇到错误
     */
    ERROR: "error",
    /**
     * 网速失速
     */
    STALLED: "stalled",

    /**
     * play()和autoplay开始播放时触发
     */
    PLAY: "myplay",
    /**
     * stop()时触发
     */
    STOP: "stop",
    /**
     * resume()时触发
     */
    RESUME: "resume",

    /**
     * pause()触发
     */
    PAUSE: "mypause",

    /**
     * 成功获取资源长度
     */
    LOADED_META_DATA: "loadedmetadata",
    LOADED_DATA: "loadeddata",
    /**
     * 等待数据，并非错误
     */
    WAITING: "waiting",
    /**
     * 开始回放
     */
    PLAYING: "playing",
    /**
     * 可以播放，但中途可能因为加载而暂停
     */
    CANPLAY: "canplay",
    /**
     * 可以播放，歌曲全部加载完毕
     */
    CANPLAY_THROUGH: "canplaythrough",
    /**
     * 寻找中
     */
    SEEKING: "seeking",
    /**
     * 寻找完毕
     */
    SEEKED: "seeked",
    /**
     * 播放时间改变
     */
    TIMEUPDATE: "timeupdate",
    /**
     * 播放结束
     */
    ENDED: "myended",
    /**
     * 播放速率改变
     */
    RETE_CHANGE: "ratechange",
    /**
     * 资源长度改变
     */
    DURATION_CHANGE: "durationchange",
    /**
     * 音量改变
     */
    VOLUME_CHANGE: "volumechange",
    /**
     * 静音改变
     */
    MUTED_CHANGE: "mutedchange",
    /**
     * 释放
     */
    RELEASE: "release",
    /**
     * 销毁
     */
    DESTROY: "destroy",
  };

  EVENTS = {
    /**
     * 加载完成 
     */
    LOADING_COMPLETED: HTMLAudio.EVENTS.CANPLAY_THROUGH,
    /**
     * 请求数据时遇到错误
     */
    ERROR: HTMLAudio.EVENTS.ERROR,
    /**
   * play()和autoplay开始播放时触发
   */
    PLAY: HTMLAudio.EVENTS.PLAY,
    /**
     * stop()时触发
     */
    STOP: HTMLAudio.EVENTS.STOP,
    /**
     * resume()时触发
     */
    RESUME: HTMLAudio.EVENTS.RESUME,

    /**
     * pause()触发
     */
    PAUSE: HTMLAudio.EVENTS.PAUSE,
    /**
    * 播放结束
    */
    ENDED: HTMLAudio.EVENTS.ENDED,
    /**
    * 播放速率改变
    */
    RETE_CHANGE: HTMLAudio.EVENTS.RETE_CHANGE,
    /**
     * 播放时间改变
     */
    TIMEUPDATE: HTMLAudio.EVENTS.TIMEUPDATE,
    /**
     * 音量改变
     */
    VOLUME_CHANGE: HTMLAudio.EVENTS.VOLUME_CHANGE,
    /**
     * 静音改变
     */
    MUTED_CHANGE: HTMLAudio.EVENTS.MUTED_CHANGE,
    /**
 * 释放
 */
    RELEASE: HTMLAudio.EVENTS.RELEASE,
    /**
     * 销毁
     */
    DESTROY: HTMLAudio.EVENTS.DESTROY,
  };

  /**
   * 别名
   */
  private _alias: string;
  private htmleventMap: Map<string, Function> = new Map();
  isPlaying: boolean = false;
  isPause: boolean = false;
  element: HTMLAudioElement;
  private _onEnd?: () => void;
  isRelease: boolean = false;
  isDestroy: boolean = false;
  private _aminVolume: number = 1;
  private _volume: number = 1;
  private _speed: number = 1;
  fadeTween: Tween | undefined;
  private _muted: boolean = false;
  private isPrePlay: boolean = false;
  private isPrePause: boolean = false;
  private analyser?: AnalyserNode;
  private audioSrc?: MediaElementAudioSourceNode;
  /**
   * 额外参数
   */
  public paramData: any;
  private _offsetVolume: number = 1;
  private _offsetMuted: boolean = false;
  private _group!: string;
  constructor(alias: string, element: HTMLAudioElement) {
    super();
    this._alias = alias;
    if (element instanceof HTMLAudioElement) {
      this.element = element;
    } else {
      // Log.info("element:",element)
      throw new Error(`加载资源时 ${alias} 不是 音频资源！`);
    }
    HTMLAudioManager.getInstance().setHTMLAudio(alias, this);
    this.init();
  }
  public update(dt: number) {

  }
  
  private initaudio() {
    if(this.analyser){
      return;
    }
    this.analyser = HTMLAudioManager.mApplicationAudioContext.createAnalyser();
    this.audioSrc = HTMLAudioManager.mApplicationAudioContext.createMediaElementSource(this.element);
    this.audioSrc.connect(this.analyser);
  }

  /**
   * 将当前频率数据复制到Uint8Array传递给它的（无符号字节数组）中。
   * @param array 
   */
  getByteFrequencyData(array: Uint8Array) {
    this.initaudio();
    if (this.analyser) {
      this.analyser.getByteFrequencyData(array);
    }
  }

  /**
   * 将当前波形或时域数据复制到Uint8Array传递给它的（无符号字节数组）中。
   * @param array 
   */
  getByteTimeDomainData(array: Uint8Array) {
    this.initaudio();
    if (this.analyser) {
      this.analyser.getByteTimeDomainData(array);
    }
  }

  /**
   * 将当前频率数据复制到Float32Array传递给它的数组中。
   * @param array 
   */
  getFloatFrequencyData(array: Float32Array) {
    this.initaudio();
    if (this.analyser) {
      this.analyser.getFloatFrequencyData(array);
    }
  }

  /**
   * 将当前波形或时域数据复制到Float32Array传递给它的数组中。
   * @param array 
   */
  getFloatTimeDomainData(array: Float32Array) {
    this.initaudio();
    if (this.analyser) {
      this.analyser.getFloatTimeDomainData(array);
    }
  }
  /**
   * 初始化
   */
  init() {
    this.group = "default";
    this.paramData = undefined;
    this.isPrePlay = false;
    this.isPrePause = false;
    this.isRelease = false;
    this.isPlaying = false;
    this.isPause = false;
    this.currentTime = 0;
    this.loop = false;
    this._offsetVolume = 1;
    this._aminVolume = 1;
    this.volume = 1;
    this._offsetMuted = false;
    this.muted = false;
    this.speed = 1;
    this.registerHtmlEvents();
  }

  /**
   * 克隆一个新实例对象
   */
  clone(): HTMLAudio {
    let audio = HTMLAudioManager.getInstance().pop(this.alias);
    if (audio) {
      audio.init();
      return audio;
    }
    return new HTMLAudio(
      this.alias,
      <HTMLAudioElement>this.element.cloneNode(true)
    );
  }

  /**
   * 播放声音
   */
  play() {
    // Log.info(
    //   "声音呵呵呵----",
    //   this.alias,
    //   "播放",
    //   this.isPrePlay,
    //   this.isPrePause,
    //   this.isRelease,
    //   HTMLAudioManager.isGlobalPause,
    //   HTMLAudioManager.isOffsetPause,
    //   this.isPlaying
    // );
    if (this.isPrePause) {
      return;
    }
    if (this.isRelease || this.isDestroy) {
      return;
    }
    if (HTMLAudioManager.getInstance().isGlobalPause || HTMLAudioManager.getInstance().isOffsetPause) {
      this.isPrePlay = true;
      return;
    }
    this.isPlaying = true;
    this.isPause = false;
    this.isPrePlay = false;
    this.currentTime = 0;
    this.setEnd();
    this.element.play();
    this.emit(HTMLAudio.EVENTS.PLAY);
  }

  /**
   * 停止声音
   */
  stop() {
    // Log.info(
    //   "声音呵呵呵----",
    //   this.alias,
    //   "stop",
    //   this.isPrePlay,
    //   this.isPrePause,
    //   this.isRelease,
    //   HTMLAudioManager.isGlobalPause,
    //   HTMLAudioManager.isOffsetPause,
    //   this.isPlaying,
    //   this.isEnded
    // );
    this.isPrePlay = false;
    this.isPause = false;
    if (this.isEnded || !this.isPlaying) {
      return;
    }
    this.isPlaying = false;
    this.currentTime = this.duration;

    this.element.pause();
    this.emit(HTMLAudio.EVENTS.STOP);
  }
  /**
   * 恢复声音
   */
  resume() {
    // Log.info(
    //   "声音呵呵呵----",
    //   this.alias,
    //   "resume",
    //   this.isPrePlay,
    //   this.isPrePause,
    //   this.isRelease,
    //   HTMLAudioManager.isGlobalPause,
    //   HTMLAudioManager.isOffsetPause,
    //   this.isPlaying,
    //   this.isEnded
    // );
    if (this.isPrePause) {
      this.isPrePause = false;
      this.play();
      return;
    }
    if (
      !this.isPause ||
      HTMLAudioManager.getInstance().isGlobalPause ||
      HTMLAudioManager.getInstance().isOffsetPause ||
      this.isEnded
    ) {
      return;
    }
    this.isPlaying = true;
    this.isPause = false;
    this.isPrePause = false;
    this.element.play();
    this.emit(HTMLAudio.EVENTS.RESUME);
  }
  /**
   * 暂停声音
   */
  pause() {
    // Log.info(
    //   "声音呵呵呵----",
    //   this.alias,
    //   "pause",
    //   this.isPrePlay,
    //   this.isPrePause,
    //   this.isRelease,
    //   HTMLAudioManager.isGlobalPause,
    //   HTMLAudioManager.isOffsetPause,
    //   this.isPlaying,
    //   this.isEnded
    // );
    if (this.isPrePlay) {
      this.isPrePause = true;
    }
    if (!this.isPlaying || this.isEnded) {
      return;
    }
    this.isPlaying = false;
    this.isPause = true;
    this.element.pause();
    this.emit(HTMLAudio.EVENTS.PAUSE);
  }
  /**
   * 全局暂停
   */
  _globalPause() {
    if (this.isRelease) {
      return;
    }
    if (!this.isPause) {
      // Log.info(
      //   "声音呵呵呵----",
      //   this.alias,
      //   "_globalPause",
      //   this.isPrePlay,
      //   this.isPrePause,
      //   this.isRelease,
      //   HTMLAudioManager.getInstance().isGlobalPause,
      //   HTMLAudioManager.getInstance().isOffsetPause,
      //   this.isPlaying,
      //   this.isEnded
      // );
      this.pause();
    }
  }
  /**
   * 全局恢复
   */
  _globalResume() {
    if (HTMLAudioManager.getInstance().isGlobalPause &&
      HTMLAudioManager.getInstance().isOffsetPause || this.isRelease) {
      return;
    }
    // Log.info(
    //   "声音呵呵呵----",
    //   this.alias,
    //   "_globalResume",
    //   this.isPrePlay,
    //   this.isPrePause,
    //   this.isRelease,
    //   HTMLAudioManager.getInstance().isGlobalPause,
    //   HTMLAudioManager.getInstance().isOffsetPause,
    //   this.isPlaying,
    //   this.isEnded,
    //   this.isPause
    // );
    if (this.isPrePlay) {
      this.play();
    } else {
      this.resume();
    }
  }

  /**
   * 获取当前音频别名
   */
  get alias(): string {
    return this._alias;
  }

  /**
   * 当前播放的位置
   */
  set currentTime(currentTime: number) {
    this.element.currentTime = currentTime;
  }
  get currentTime(): number {
    return this.element.currentTime;
  }

  /**
   * 循环
   */
  set loop(loop: boolean) {
    this.element.loop = loop;
  }
  get loop(): boolean {
    return this.element.loop;
  }

  /**
   * 设置group归属
   */
  set group(group: string) {
    if (this.group == group) {
      return;
    }
    HTMLAudioGroupManager.getInstance().remove(this);
    this._group = group;
    if (!this.isDestroy) {
      HTMLAudioGroupManager.getInstance().addAudio(this);
    }
    this.volume = this.volume;
    this.muted = this.muted;
  }
  get group(): string {
    return this._group;
  }

  /**
   * 组的音量
   */
  get groupVolume(): number {
    return HTMLAudioGroupManager.getInstance().getGroup(this.group).volume;
  }

  /**
   * 组是否静音
   */
  get groupMuted(): boolean {
    return HTMLAudioGroupManager.getInstance().getGroup(this.group).muted;
  }

  get realSpeed(): number {
    return this.speed * HTMLAudioManager.getInstance().globalSpeed;
  }
  get realVolume(): number {
    return this.volume *
      this.aminVolume *
      this.offsetVolume *
      this.groupVolume *
      HTMLAudioManager.getInstance().globalVolume;
  }
  get realMuted(): boolean {
    return this.muted ||
      this.offsetMuted ||
      this.groupMuted ||
      HTMLAudioManager.getInstance().globalMuted
  }
  /**
   * 音量
   */
  set volume(volume: number) {
    this._volume = volume;
    this.element.volume = this.realVolume;
    this.emit(HTMLAudio.EVENTS.VOLUME_CHANGE, this.realMuted);
  }
  get volume(): number {
    return this._volume;
  }

  /**
   * 动画音量
   */
  set aminVolume(aminVolume: number) {
    this._aminVolume = aminVolume;
    this.volume = this.volume;
  }
  get aminVolume(): number {
    return this._aminVolume;
  }

  /**
   * 偏移音量
   */
  set offsetVolume(offsetVolume: number) {
    this._offsetVolume = offsetVolume;
    this.volume = this.volume;
  }
  get offsetVolume(): number {
    return this._offsetVolume;
  }

  /**
   * 静音
   */
  set muted(muted: boolean) {
    this._muted = muted;
    this.element.muted = this.realMuted;
    this.emit(HTMLAudio.EVENTS.MUTED_CHANGE, this.realMuted);
  }
  get muted(): boolean {
    return this._muted;
  }
  set offsetMuted(offsetMuted: boolean) {
    this._offsetMuted = offsetMuted;
    this.muted = this.muted;
  }
  get offsetMuted(): boolean {
    return this._offsetMuted;
  }

  /**
   * 播放速度
   */
  set speed(speed: number) {
    this._speed = speed;
    let currSpeed = speed * HTMLAudioManager.getInstance().globalSpeed;
    this.element.playbackRate = this.realSpeed;
    this.emit(HTMLAudio.EVENTS.RETE_CHANGE, this.realSpeed);
  }
  get speed(): number {
    return this._speed;
  }

  /**
   * 资源时长
   */
  get duration(): number {
    return this.element.duration;
  }

  fadeIn(time: number, callback?: () => void) {
    this.runVolumeTween(time, 0, 1, callback);
  }
  fadeOut(time: number, callback?: () => void) {
    this.runVolumeTween(time, 1, 0, callback);
  }
  fadeTo(time: number, volume: number, callback?: () => void) {
    this.runVolumeTween(time, this.aminVolume, volume, callback);
  }

  private runVolumeTween(
    time: number,
    sVolume: number,
    eVolume: number,
    callback?: () => void
  ) {
    if (this.fadeTween) {
      this.fadeTween.stop().remove();
      this.fadeTween = undefined;
    }
    this.fadeTween = TweenManager.builder(this)
      .from({ aminVolume: sVolume })
      .to({ aminVolume: eVolume })
      .time(time)
      .setExpire(true)
      .on("end", () => {
        this.fadeTween?.remove();
        this.fadeTween = undefined;
        callback && callback();
      })
      .start();
  }

  /**
   * 注册html事件
   */
  registerHtmlEvents() {
    let events = <any>HTMLAudio.EVENTS;
    for (let key in events) {
      let name = events[key];
      if (!this.htmleventMap.has(name)) {
        let self = this;
        let callback = function () {
          let a = new Array();
          for (let i = 0; i < arguments.length; i++) {
            a[i] = arguments[i];
          }
          self.emit(name, ...a);
        };
        this.element.addEventListener(name, callback);
        this.htmleventMap.set(name, callback);
      }
    }
  }

  setEnd() {
    this.removeEnd();
    if (!this._onEnd) {
      this._onEnd = this.onEnd.bind(this);
      this.element.addEventListener("ended", this._onEnd);
    }
  }
  removeEnd() {
    if (this._onEnd) {
      this.element.removeEventListener("ended", this._onEnd);
      this._onEnd = undefined;
    }
  }

  private onEnd() {
    if (this.loop) {
      return;
    }
    this.removeEnd();
    let a = new Array();
    for (let i = 0; i < arguments.length; i++) {
      a[i] = arguments[i];
    }
    this.isPlaying = false;
    this.isPause = false;
    this.currentTime = this.duration;
    this.emit(HTMLAudio.EVENTS.ENDED, ...a);
  }

  public get isEnded(): boolean {
    return this.currentTime == this.duration;
  }
  /**
   * 移除html 事件
   */
  removeHtmlEvents() {
    let element = this.element;
    this.htmleventMap.forEach((v, k) => {
      element.removeEventListener(<any>k, <any>v);
    });
    this.htmleventMap.clear();
    this.removeEnd();
  }
  /**
   * 移除 普通事件
   */
  removeEvents() {
    let events = <any>HTMLAudio.EVENTS;
    for (let key in events) {
      this.off(events[key]);
    }
  }
  /**
   * 加载资源
   * @param callback
   */
  load(callback?: () => void) {
    if (callback) {
      let eventListener = () => {
        this.element.removeEventListener("canplay", eventListener);
        callback && callback();
      };
      this.element.addEventListener("canplay", eventListener);
    }
    this.element.load();
  }
  /**
   * 释放
   * 释放后，资源会回到HTMLAudioManager中，方便下次复用。
   */
  release() {
    this.group = "default";
    this.paramData = undefined;
    this.isPrePlay = false;
    this.isPrePause = false;
    this.isRelease = true;
    this.emit(this.EVENTS.RELEASE);
    this.removeHtmlEvents();
    this.removeEvents();
    this.stop();
    if(this.audioSrc){
      this.audioSrc.disconnect();
      this.audioSrc = undefined;
    }
    if(this.analyser){
      this.analyser.disconnect();
      this.analyser = undefined;
    }
    this.isPlaying = false;
    if (this.fadeTween) {
      this.fadeTween.stop().remove();
      this.fadeTween = undefined;
    }
  }
  /**
   * 从内存中销毁
   */
  destroy() {
    if (this.isDestroy) {
      return;
    }
    this.isDestroy = true;
    HTMLAudioGroupManager.getInstance().remove(this);
    HTMLAudioManager.getInstance().removeAudio(this.alias, this);
    this.emit(this.EVENTS.DESTROY);
    this.release();
    
    // (<any>this).element = null;
  }
}
