import { Container, Point } from "pixi.js";
import { Canvas, Component, EventPoint, Image, VideoManager } from "..";
import { GameManager } from "../core/GameManager";
import { EventManager } from "../event/EventManager";
import { GameTexture } from "../gui/GameTexture";
import { Log } from "../log/Log";
import { VideoUI } from "./VideoUI";

export class VideoComponent extends Component {
  public static END = "END";
  protected rootComponent!: Component;
  protected renderView!: Image;
  protected renderTexture!: GameTexture;
  protected _videoData!: HTMLVideoElement;

  /**
   * 是否播放
   */
  public isPlay: boolean = false;

  protected mPlayUIParent!: Component;
  protected mPlayUI!: VideoUI;
  protected _x: number = 0;
  protected _y: number = 0;
  protected _anchor!: EventPoint;
  private _volume: number = 1;
  private _muted: boolean = false;
  private _speed: number = 1;

  private isPrePlay: boolean = false;
  private isPrePause: boolean = false;
  public isPause: boolean = false;
  public isPlaying: boolean = false;
  constructor() {
    super();
    this._anchor.on("chageX", () => {
      this.x = this.x;
      this.emit("chageAnchor");
    });
    this._anchor.on("chageY", () => {
      this.y = this.y;
      this.emit("chageAnchor");
    });
    VideoManager.push(this);
  }

  draw() {
    super.draw();
    if (!this._anchor) {
      this._anchor = new EventPoint();
    }
    if (!this.rootComponent) {
      this.rootComponent = new Component();
      this.addChild(this.rootComponent);
    }
    if (!this.mPlayUIParent) {
      this.mPlayUIParent = new Component();
      this.mPlayUIParent.zIndex = 2;
      this.rootComponent.addChild(this.mPlayUIParent);
    }
    if (!this.renderView) {
      this.renderView = new Image();
      this.rootComponent.addChild(this.renderView);
      this.videoData = document.createElement("video");
    }

    if (!this.mPlayUI) {
      this.setDefaultPlayUI();
    }
  }

  /**
   * 设置音频数据
   */
  set videoData(videoData: HTMLVideoElement) {
    this.stop();
    if(!videoData){
      throw new Error("音频文件已被销毁。")
    }
    this.renderTexture = GameTexture.from(videoData);
    this._videoData = <HTMLVideoElement>(
      (<any>this.renderTexture.baseTexture.resource).source
    );
    //兼容腾讯  x5引擎
    this._videoData.setAttribute("x5-video-player-type", "h5");

    this.renderView.texture = this.renderTexture;
    this.videoData.onended = () => {
      this.isPlaying = false;
      this.emit(VideoComponent.END);
    };
    this.volume = this.videoData.volume;
    this.muted = this.videoData.muted;
    this.videoData.pause();
    this.x = this.x;
    this.y = this.y;
  }
  get videoData(): HTMLVideoElement {
    return this._videoData;
  }

  /**
   * 是否静音
   */
  set muted(muted: boolean) {
    this._muted = muted;
    this.videoData.muted = this.realMuted ;
  }
  get muted(): boolean {
    return this._muted ;
  }
  /**
   * 设置或返回视频是否应在结束时再次播放。
   */
  set loop(loop: boolean) {
    this.videoData.loop = loop;
  }
  get loop(): boolean {
    return this.videoData.loop;
  }
  /**
   * 获取当前的播放时间
   */
  set currentTime(currentTime: number) {
    if(!this.videoData || isNaN(currentTime)){
      return;
    }
    this.videoData.currentTime = currentTime;
  }
  get currentTime(): number {
    if(!this.videoData){
      return 0;
    }
    return this.videoData.currentTime;
  }

    /**
   * 播放速度
   */
  set speed(speed: number) {
    this._speed = speed;
    this.videoData.playbackRate = this.realSpeed;
  }
  get speed(): number {
    return this._speed;
  }

  /**
   * 获取真实音量
   */
  get realVolume():number{
    return  this.volume *
    VideoManager.globalVolume;
  }

  get realSpeed():number{
    return this.speed * VideoManager.globalSpeed;
  }

  /**
   * 获取真实音量
   */
  get realMuted():boolean{
    return this.muted ||
    VideoManager.globalMuted;
  }

  /**
   * 设置或返回视频的音量。
   */
  set volume(volume: number) {
    this._volume = volume;
    this.videoData.volume = this.realVolume;
    Log.info("声音",this.videoData,this.realVolume);
  }
  get volume(): number {
    return this._volume;
  }

  /**
   * 返回视频的长度（以秒计）。
   */
  get duration(): number {
    if(!this.videoData){
      return 0;
    }
    return this.videoData.duration;
  }
  /**
   * false 点击了播放  true 点击了暂停
   */
  get paused(): boolean {
    return this.videoData.paused;
  }

  /**
   * 播放速度
   */
  set playbackRate(playbackRate: number) {
    this.speed = playbackRate;
  }
  get playbackRate(): number {
    return this.speed;
  }


  public get isEnded(): boolean {
    return this.currentTime == this.duration;
  }

  private _play(){
    this.videoData.play();
    this.unscheduleAll();
    this.mPlayUI && this.mPlayUI.removeFromParent();
    this.schedule(() => {
      if (this.currentTime == 0) {
        this.showPlayUI();
      }else{
        this.mPlayUI && this.mPlayUI.removeFromParent();
        this.unscheduleAll();
      }
    }, 100 * GameManager.gameSpeed);
    this.isPlaying = true;
  }
  private _stop(){
    if(this.isPlaying){
      this.videoData.pause();
    }
    this.isPlaying = false;
  }

    /**
   * 播放声音
   */
  play() {
    if (this.isPrePause) {
      return;
    }
    if (this.isDestroy) {
      return;
    }
    if (
      VideoManager.isGlobalPause ||
      VideoManager.isOffsetPause
    ) {
      this.isPrePlay = true;
      return;
    }
    // Log.info("播放音频：", this.alias, this.isConnect);
    this.isPause = false;
    this.isPrePlay = false;
    this.currentTime = 0;
    
    this._play();

  }

  /**
   * 停止声音
   */
  stop() {
    this.isPrePlay = false;
    this.currentTime = this.duration;
    this.isPause = false;
    if (this.isEnded || !this.isPlaying) {
      return;
    }
    this._stop();
    // this.currentTime = this.duration;

  }
  /**
   * 恢复声音
   */
  resume() {
    if (this.isPrePause) {
      this.isPrePause = false;
      this.play();
      return;
    }
    if (
      !this.isPause ||
      VideoManager.isGlobalPause ||
      VideoManager.isOffsetPause ||
      this.isEnded
    ) {
      return;
    }
    this.isPause = false;
    this.isPrePause = false;
    this._play();

  }
  /**
   * 暂停声音
   */
  pause() {
    if (this.isPrePlay) {
      this.isPrePause = true;
    }
    if (!this.isPlaying || this.isEnded) {
      return;
    }
    this.isPause = true;
    this._stop();

  }

    /**
   * 全局暂停
   */
  _globalPause() {
    if (this.isDestroy) {
      return;
    }
    if (!this.isPause) {
      this.pause();
    }
  }
  /**
   * 全局恢复
   */
  _globalResume() {
    if (
      (VideoManager.isGlobalPause &&
        VideoManager.isOffsetPause) ||
      this.isDestroy
    ) {
      return;
    }
    if (this.isPrePlay) {
      this.play();
    } else {
      this.resume();
    }
  }

  setDefaultPlayUI() {
    let ui = new VideoUI();
    let cxt = new Canvas();
    cxt.lineStyle(20, 0x000000, 0.7, 1);
    cxt.beginFill(0xffffff, 0.7);
    cxt.moveTo(0, 60);
    cxt.lineTo(40, 0);
    cxt.lineTo(80, 60);
    cxt.closePath();
    cxt.endFill();
    ui.addChild(cxt);
    cxt.rotate = 90;
    cxt.x = 30;
    cxt.y = -40;

    let img = new Image();
    img.width = 130;
    img.height = 130;
    img.anchor.set(0.5);
    ui.addChild(img);
    img.on(EventManager.ALL_CLICK, () => {
      ui.play();
    });
    this.setPlayUI(ui);
  }

  setPlayUI(ui: VideoUI) {
    if (ui == this.mPlayUI) {
      return;
    }
    if (this.mPlayUI) {
      this.mPlayUI.destroy();
    }
    this.mPlayUI = ui;
    this.mPlayUI.initVideo(this);
  }

  showPlayUI() {
    if (this.mPlayUI.parent == <Container>(<unknown>this.mPlayUIParent)) return;
    this.mPlayUIParent.addChild(this.mPlayUI);
  }

  set width(width: number) {
    this.renderView.width = width;
    this.x = this.x;
  }
  get width(): number {
    return this.renderView.width;
  }
  set height(height: number) {
    this.renderView.height = height;
    this.y = this.y;
  }
  get height(): number {
    return this.renderView.height;
  }

  set x(x: number) {
    this.renderView.x = x - this.anchor.x * this.width;
    this.mPlayUIParent.x =  x - (this.anchor.x - 0.5) * this.width;
    // Log.info("设置x:",x,this.mPlayUIParent)
    this._x = x;
  }
  get x(): number {
    return this._x;
  }
  set y(y: number) {
    this.renderView.y = y - this.anchor.y * this.height;
    this.mPlayUIParent.y = y - (this.anchor.y-0.5) * this.height;
    this._y = y;
  }
  get y(): number {
    return this._y;
  }

  set anchor(anchor: Point) {
    this._anchor = <EventPoint>anchor;
    this.x = this.x;
    this.y = this.y;
  }
  get anchor(): Point {
    return this._anchor;
  }

  destroy() {
    VideoManager.remove(this);
    super.destroy();
    this.stop();
  }
}
