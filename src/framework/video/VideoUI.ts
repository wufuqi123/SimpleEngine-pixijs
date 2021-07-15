import { Component } from "../core/Component";
import { VideoComponent } from "./VideoComponent";

export class VideoUI extends Component {
  private mVideo: VideoComponent|undefined;
  public initVideo(video:VideoComponent){
    this.mVideo = video;
  }

  /**
   * 是否静音
   */
  set muted(muted: boolean) {
    if(!this.mVideo){
      throw new Error("video 没有初始化  无法调用 muted 属性！");
    }
    this.mVideo.muted = muted;
  }
  get muted(): boolean {
    if(!this.mVideo){
      throw new Error("video 没有初始化  无法调用 muted 属性！");
    }
    return this.mVideo.muted;
  }
  /**
   * 设置或返回视频是否应在结束时再次播放。
   */
  set loop(loop: boolean) {
    if(!this.mVideo){
      throw new Error("video 没有初始化  无法调用 loop 属性！");
    }
    this.mVideo.loop = loop;
  }
  get loop(): boolean {
    if(!this.mVideo){
      throw new Error("video 没有初始化  无法调用 loop 属性！");
    }
    return this.mVideo.loop;
  }
  /**
   * 获取当前的播放时间
   */
  set currentTime(currentTime: number) {
    if(!this.mVideo){
      throw new Error("video 没有初始化  无法调用 currentTime 属性！");
    }
    this.mVideo.currentTime = currentTime;
  }
  get currentTime(): number {
    if(!this.mVideo){
      throw new Error("video 没有初始化  无法调用 currentTime 属性！");
    }
    return this.mVideo.currentTime;
  }
  /**
   * 设置或返回视频的音量。
   */
  set volume(volume: number) {
    if(!this.mVideo){
      throw new Error("video 没有初始化  无法调用 volume 属性！");
    }
    this.mVideo.volume = volume;
  }
  get volume(): number {
    if(!this.mVideo){
      throw new Error("video 没有初始化  无法调用 volume 属性！");
    }
    return this.mVideo.volume;
  }



  set playbackRate(playbackRate: number) {
    if(!this.mVideo){
      throw new Error("video 没有初始化  无法调用 playbackRate 属性！");
    }
    this.mVideo.playbackRate = playbackRate;
  }
  get playbackRate(): number {
    if(!this.mVideo){
      throw new Error("video 没有初始化  无法调用 playbackRate 属性！");
    }
    return this.mVideo.playbackRate;
  }

  /**
   * 返回视频的长度（以秒计）。
   */
  get duration(): number {
    if(!this.mVideo){
      throw new Error("video 没有初始化  无法调用 duration 属性！");
    }
    return this.mVideo.duration;
  }
  /**
   * false 点击了播放  true 点击了暂停
   */
  get paused(): boolean {
    if(!this.mVideo){
      throw new Error("video 没有初始化  无法调用 paused 属性！");
    }
    return this.mVideo.paused;
  }

  play(){
    if(!this.mVideo){
      throw new Error("video 没有初始化  无法调用 play 方法！");
    }
    this.mVideo.play();
  }
  pause(){
    if(!this.mVideo){
      throw new Error("video 没有初始化  无法调用 pause 方法！");
    }
    this.mVideo.pause();
  }
  resume(){
    if(!this.mVideo){
      throw new Error("video 没有初始化  无法调用 resume 方法！");
    }
    this.mVideo.resume();
  }
  stop(){
    if(!this.mVideo){
      throw new Error("video 没有初始化  无法调用 stop 方法！");
    }
    this.mVideo.stop();
  }

  destroy(){
    super.destroy();
    if(this.mVideo){
      this.mVideo = undefined;
    }
  }
}