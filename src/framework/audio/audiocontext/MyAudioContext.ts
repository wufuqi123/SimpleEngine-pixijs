import { Log } from "../../log/Log";
import { Tween } from "../../tween/Tween";
import { TweenManager } from "../../tween/TweenManager";
import { EventEmitter } from "eventemitter3";
import { AudioInterface } from "../interface/AudioInterface";
import { AudioContextManager } from "./AudioContextManager";
import { AudioContextGroupManager } from "./AudioContextGroupManager";
import { LoaderResource } from "pixi.js";

export class MyAudioContext extends EventEmitter implements AudioInterface {
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
    LOADING_COMPLETED: MyAudioContext.EVENTS.CANPLAY_THROUGH,
    /**
     * 请求数据时遇到错误
     */
    ERROR: MyAudioContext.EVENTS.ERROR,
    /**
     * play()和autoplay开始播放时触发
     */
    PLAY: MyAudioContext.EVENTS.PLAY,
    /**
     * stop()时触发
     */
    STOP: MyAudioContext.EVENTS.STOP,
    /**
     * resume()时触发
     */
    RESUME: MyAudioContext.EVENTS.RESUME,

    /**
     * pause()触发
     */
    PAUSE: MyAudioContext.EVENTS.PAUSE,
    /**
     * 播放结束
     */
    ENDED: MyAudioContext.EVENTS.ENDED,
    /**
     * 播放速率改变
     */
    RETE_CHANGE: MyAudioContext.EVENTS.RETE_CHANGE,
    /**
     * 播放时间改变
     */
    TIMEUPDATE: MyAudioContext.EVENTS.TIMEUPDATE,
    /**
     * 音量改变
     */
    VOLUME_CHANGE: MyAudioContext.EVENTS.VOLUME_CHANGE,
    /**
     * 静音改变
     */
    MUTED_CHANGE: MyAudioContext.EVENTS.MUTED_CHANGE,
    /**
     * 释放
     */
    RELEASE: MyAudioContext.EVENTS.RELEASE,
    /**
     * 销毁
     */
    DESTROY: MyAudioContext.EVENTS.DESTROY,
  };
  /**
   * 别名
   */
  private _alias: string;
  isPlaying: boolean = false;
  isPause: boolean = false;
  private element!: AudioBufferSourceNode;
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
  /**
   * 额外参数
   */
  public paramData: any;
  private _offsetVolume: number = 1;
  private _offsetMuted: boolean = false;
  private _group!: string;
  private resource: LoaderResource;
  private isConnect!: boolean;
  private gain!: GainNode;
  private _loop: boolean = false;
  private _currentTime: number = 0;
  analyser!: AnalyserNode;
  constructor(alias: string, resource: LoaderResource) {
    super();
    this._alias = alias;
    this.resource = resource;

    AudioContextManager.getInstance().pushAudio(alias, this);
    this.init();
  }

  /**
   * 初始化
   */
  init() {
    this.disconnect();
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
  }

  /**
   * 克隆一个新实例对象
   */
  clone(): MyAudioContext {
    let audio = AudioContextManager.getInstance().pop(this.alias);
    if (audio) {
      audio.init();
      return audio;
    }
    return new MyAudioContext(this.alias, this.resource);
  }

  private _play() {
    if (this.isConnect) {
      this.disconnect();
    }
    this.connect();
    // Log.info(
    //   "播放音频：",
    //   "djdjdjdj",
    //   this.speed,
    //   this.element,
    //   this.currentTime,
    //   this.duration
    // );
    this.changeData();
    // this.element.start(0, this.currentTime,0);
    this.element.start(0, this.currentTime);
    this.isPlaying = true;
  }
  private _stop() {
    if (this.isPlaying) {
      this.element.stop(0);
    }
    // console.info("暂停")
    // Timer.setTimeout(() => {
    this.disconnect();
    // }, 100);
    this.isPlaying = false;
  }
  public update(dt: number) {
    if (!this.isPlaying || !this.element) {
      return;
    }
    this._currentTime += (dt * this.realSpeed) / 1000;
    if (this._currentTime <= 0) {
      this._currentTime = 0;
    } else if (this._currentTime > this.duration) {
      this._currentTime = this.duration;
    }
    this.emit(MyAudioContext.EVENTS.TIMEUPDATE, this._currentTime);
  }

  /**
   * 将当前频率数据复制到Uint8Array传递给它的（无符号字节数组）中。
   * @param array 
   */
  getByteFrequencyData(array: Uint8Array) {
    if (this.analyser) {
      this.analyser.getByteFrequencyData(array);
    }
  }

  /**
   * 将当前波形或时域数据复制到Uint8Array传递给它的（无符号字节数组）中。
   * @param array 
   */
  getByteTimeDomainData(array: Uint8Array) {
    if (this.analyser) {
      this.analyser.getByteTimeDomainData(array);
    }
  }

  /**
   * 将当前频率数据复制到Float32Array传递给它的数组中。
   * @param array 
   */
  getFloatFrequencyData(array: Float32Array) {
    if (this.analyser) {
      this.analyser.getFloatFrequencyData(array);
    }
  }

  /**
   * 将当前波形或时域数据复制到Float32Array传递给它的数组中。
   * @param array 
   */
  getFloatTimeDomainData(array: Float32Array) {
    if (this.analyser) {
      this.analyser.getFloatTimeDomainData(array);
    }
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
    //   AudioContextManager.getInstance().isGlobalPause,
    //   AudioContextManager.getInstance().isOffsetPause,
    //   this.isPlaying
    // );
    if (this.isPrePause) {
      return;
    }
    if (this.isRelease || this.isDestroy) {
      return;
    }
    if (
      AudioContextManager.getInstance().isGlobalPause ||
      AudioContextManager.getInstance().isOffsetPause
    ) {
      this.isPrePlay = true;
      return;
    }
    Log.info("播放音频：", this.alias, this.isConnect);
    this.isPause = false;
    this.isPrePlay = false;
    this.currentTime = 0;

    this._play();
    this.emit(MyAudioContext.EVENTS.PLAY);
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
    //   AudioContextManager.isGlobalPause,
    //   AudioContextManager.isOffsetPause,
    //   this.isPlaying,
    //   this.isEnded
    // );
    this.isPrePlay = false;
    this.isPause = false;
    if (this.isEnded || !this.isPlaying) {
      return;
    }
    this.isPlaying = false;
    this._stop();

    this._currentTime = this.duration;
    this.emit(MyAudioContext.EVENTS.STOP);
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
    //   AudioContextManager.getInstance().isGlobalPause,
    //   AudioContextManager.getInstance().isOffsetPause,
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
      AudioContextManager.getInstance().isGlobalPause ||
      AudioContextManager.getInstance().isOffsetPause ||
      this.isEnded
    ) {
      return;
    }
    this.isPlaying = true;
    this.isPause = false;
    this.isPrePause = false;
    this._play();
    this.emit(MyAudioContext.EVENTS.RESUME);
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
    //   AudioContextManager.isGlobalPause,
    //   AudioContextManager.isOffsetPause,
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
    this._stop();
    this.emit(MyAudioContext.EVENTS.PAUSE);
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
      //   AudioContextManager.getInstance().isGlobalPause,
      //   AudioContextManager.getInstance().isOffsetPause,
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
    if (
      (AudioContextManager.getInstance().isGlobalPause &&
        AudioContextManager.getInstance().isOffsetPause) ||
      this.isRelease
    ) {
      return;
    }
    // Log.info(
    //   "声音呵呵呵----",
    //   this.alias,
    //   "_globalResume",
    //   this.isPrePlay,
    //   this.isPrePause,
    //   this.isRelease,
    //   AudioContextManager.getInstance().isGlobalPause,
    //   AudioContextManager.getInstance().isOffsetPause,
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
    if (currentTime > this.duration) {
      throw new Error(
        `音频：${this.alias} ,当前设置的currentTime：${currentTime}大于duration总时间${this.duration}`
      );
    }
    this._currentTime = currentTime;
    if (this.isPlaying && this.currentTime != this.duration) {
      this._stop();
      this._play();
    }
    this.emit(MyAudioContext.EVENTS.TIMEUPDATE, currentTime);
  }
  get currentTime(): number {
    return this._currentTime;
  }

  /**
   * 循环
   */
  set loop(loop: boolean) {
    this._loop = loop;
    // this.changeData();
  }
  get loop(): boolean {
    return this._loop;
  }

  /**
   * 设置group归属
   */
  set group(group: string) {
    if (this.group == group) {
      return;
    }
    AudioContextGroupManager.getInstance().remove(this);
    this._group = group;
    if (!this.isDestroy) {
      AudioContextGroupManager.getInstance().addAudio(this);
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
    return AudioContextGroupManager.getInstance().getGroup(this.group).volume;
  }

  /**
   * 组是否静音
   */
  get groupMuted(): boolean {
    return AudioContextGroupManager.getInstance().getGroup(this.group).muted;
  }

  /**
   * 音量
   */
  set volume(volume: number) {
    this._volume = volume;
    this.emit(MyAudioContext.EVENTS.VOLUME_CHANGE, this.realVolume);
    this.changeData();
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
    this.emit(MyAudioContext.EVENTS.VOLUME_CHANGE, this.realMuted);
    this.changeData();
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
    this.emit(MyAudioContext.EVENTS.RETE_CHANGE, this.realSpeed);
    this.changeData();
  }
  get speed(): number {
    return this._speed;
  }

  get realSpeed(): number {
    return this.speed * AudioContextManager.getInstance().globalSpeed;
  }
  get realVolume(): number {
    return (
      this.volume *
      this.aminVolume *
      this.offsetVolume *
      this.groupVolume *
      AudioContextManager.getInstance().globalVolume
    );
  }
  get realMuted(): boolean {
    return (
      this.muted ||
      this.offsetMuted ||
      this.groupMuted ||
      AudioContextManager.getInstance().globalMuted
    );
  }

  private changeData() {
    if (!this.element) {
      return;
    }
    // this.element.loop = this.loop;
    let currVolume = this.realVolume;
    if (this.realMuted) {
      currVolume = 0;
    }
    this.element.playbackRate.setValueAtTime(this.realSpeed, 0);
    this.gain.gain.setValueAtTime(currVolume, 0);
  }
  /**
   * 资源时长
   */
  get duration(): number {
    let buffer = AudioContextManager.getInstance().getAudioBuffer(this.alias);
    if (!buffer) {
      return 0;
    }
    return buffer.duration;
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
      this.element.removeEventListener("ended", <any>null);
      this._onEnd = undefined;
    }
  }

  private onEnd() {
    if (this.loop) {
      this.play();
      return;
    }
    this.removeEnd();
    this.disconnect();
    let a = new Array();
    for (let i = 0; i < arguments.length; i++) {
      a[i] = arguments[i];
    }
    this.isPlaying = false;
    this.isPause = false;
    this._currentTime = this.duration;
    this.emit(MyAudioContext.EVENTS.ENDED, ...a);
  }

  public get isEnded(): boolean {
    return this.currentTime == this.duration;
  }

  /**
   * 移除 普通事件
   */
  removeEvents() {
    let events = <any>MyAudioContext.EVENTS;
    for (let key in events) {
      this.off(events[key]);
    }
    this.removeAllListeners();
  }
  /**
   * 加载资源
   * @param callback
   */
  load(callback?: () => void) {
    AudioContextManager.getInstance().loadAudioBuffer(
      this.resource,
      (buffer: AudioBuffer) => {
        callback && callback();
        this.emit(MyAudioContext.EVENTS.CANPLAY_THROUGH);
      },
      (e) => {
        this.emit(MyAudioContext.EVENTS.ERROR);
      }
    );
  }

  connect() {
    this.disconnect();
    if (!this.isConnect) {
      this.analyser = AudioContextManager.mApplicationAudioContext.createAnalyser();
      this.gain = AudioContextManager.mApplicationAudioContext.createGain();
      this.element = AudioContextManager.mApplicationAudioContext.createBufferSource();
      this.setEnd();
      let buffer = AudioContextManager.getInstance().getAudioBuffer(this.alias);
      if (buffer) {
        // console.log("连接");
        this.gain.connect(
          AudioContextManager.mApplicationAudioContext.destination
        );
        this.element.connect(this.gain);
        this.element.connect(this.analyser);
        this.element.buffer = buffer;
        this.isConnect = true;
      } else {
        throw new Error(
          `当前播放音频资源：【${this.alias}】，buffer不存在  或已被销毁，请重新加载资源！`
        );
      }
      this.changeData();
    }
  }

  disconnect() {
    if (!this.element || !this.isConnect) {
      return;
    }
    this.removeEnd();
    let gain: any = this.gain;
    let element: any = this.element;
    let analyser: any = this.analyser;
    try {
      element.buffer = null;
    } catch (e) { }
    setTimeout(() => {
      // console.info("断开连接");
      gain.disconnect();
      element.disconnect();
      analyser.disconnect();
      element = undefined;
      gain = undefined;
      analyser = undefined;
    }, 100);
    this.isConnect = false;
  }
  /**
   * 释放
   * 释放后，资源会回到AudioContextManager中，方便下次复用。
   */
  release() {
    this.emit(this.EVENTS.RELEASE);
    this.stop();
    this.disconnect();
    // Log.info("释放资源：",this.alias,this.element)
    this.group = "default";
    this.paramData = undefined;
    this.isPlaying = false;
    this.isPrePlay = false;
    this.isPrePause = false;
    this.isRelease = true;
    this.removeAllListeners();
    this.removeEvents();
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
    this.emit(this.EVENTS.DESTROY);
    this.isDestroy = true;
    AudioContextGroupManager.getInstance().remove(this);
    AudioContextManager.getInstance().removeAudio(this.alias, this);
    this.release();
    (<any>this).resource = undefined;
    (<any>this).element = undefined;
    (<any>this).gain = undefined;
    (<any>this)._onEnd = undefined;
  }
}
