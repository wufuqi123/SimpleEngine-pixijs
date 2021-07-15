import { HTMLAudio, Log, ResManager } from "../../framework";
import { EventEmitter } from "eventemitter3";
import { AudioManager } from "./AudioManager";
import { AudioInterface } from "./interface/AudioInterface";

export class Audio extends EventEmitter {
  public mAudioMap: Map<string, AudioInterface> = new Map();
  public mAudioDestroy: Map<string, boolean> = new Map();
  private _volume: number = 1;
  private _muted: boolean = false;
  private _mutedOffset: boolean = false;

  
  public set volume(volume: number) {
    this._volume = volume;
    this.mAudioMap.forEach((v) => {
      v.offsetVolume = volume;
    });
  }
  public get volume(): number {
    return this._volume;
  }
  public set muted(muted: boolean) {
    this._muted = muted;
    this.mAudioMap.forEach((v) => {
      v.offsetMuted = muted || this.mutedOffset;
    });
  }
  public get muted(): boolean {
    return this._muted;
  }
  public set mutedOffset(mutedOffset: boolean) {
    this._mutedOffset = mutedOffset;
    this.muted = this.muted;
  }
  public get mutedOffset(): boolean {
    return this._mutedOffset;
  }

  public getAudioArr():Array<AudioInterface>{
    let arr = new Array();

    this.mAudioMap.forEach(v=>{
      arr.push(v);
    })
    return arr;
  }

  /**
   * 播放音效
   * @param data
   */
  public play(data: {
    res: string;
    volume?: number;
    muted?: boolean;
    group?: string;
    destroyAudio?: boolean;
    count?: number;
    endCallback?: ()=>void;
    nick: string;
  }): string {
    let res = data.res;
    if(ResManager.noLoadingType.includes("audio")){
      ResManager.removeResource(res);
      data.endCallback && data.endCallback();
      return "";
    }
    let nick = data.nick;
    let volume = data.volume == undefined ? 1 : data.volume;
    let muted = data.muted == undefined ? false : data.muted;
    let count = data.count == undefined ? 1 : data.count;
    let destroyAudio = !!data.destroyAudio;
    this.mAudioDestroy.set(nick,destroyAudio);
    let audio = this.get(nick);
    if(audio){
      audio.release();
    }

    let index = 1;
    let loop = count < 0;
    audio = AudioManager.play(res);
    if(data.group!=undefined){
      audio.group = data.group;
    }
    audio.offsetVolume = this.volume;
    audio.offsetMuted = this.muted || this.mutedOffset;
    audio.volume = volume;
    audio.muted = muted;
    audio.loop = loop;
    audio.paramData = {
      nick,
      res,
      index,
      count,
      destroyAudio,
    }
    this.emit("play");
    this.mAudioMap.set(nick, audio);
    // console.log("加载---",nick,this.mAudioMap.size)
    audio.on(audio.EVENTS.RELEASE,()=>{
      this.mAudioMap.delete(nick);
      this.mAudioDestroy.delete(nick);
      // console.log("释放---",nick,this.mAudioMap.size)
    });
    audio.on(audio.EVENTS.DESTROY,()=>{
      this.mAudioMap.delete(nick);
      this.mAudioDestroy.delete(nick);
    });
    audio.on(audio.EVENTS.ENDED, () => {
      if(!audio){
        return;
      }
      if (loop) {
        return;
      }
      if (audio.paramData.index >= audio.paramData.count) {
        this.emit("end", nick);
        audio && audio.off(audio.EVENTS.ENDED);
        this.destroy(nick,destroyAudio);
        if(data.endCallback){
          data.endCallback();
        }
      } else {
        audio.paramData.index++;
        audio?.play();
        this.emit("replay");
      }
    });
    
    return nick;
  }

  /**
   * 获取正在播放的
   * @param nick
   */
  public get(nick: string): AudioInterface | undefined {
    return this.mAudioMap.get(nick);
  }

  /**
   * 销毁音乐
   * @param nick
   */
  public destroy(nick: string, destroyAudio?: boolean) {
    let audio = this.get(nick);
    Log.info("播放完成2",destroyAudio,audio)
    if (!audio) {
      return;
    }
    if(destroyAudio == undefined){
      destroyAudio = !!this.mAudioDestroy.get(nick);
    }
    this.mAudioMap.delete(nick);
    this.mAudioDestroy.delete(nick);
    if(destroyAudio){
      ResManager.removeResource(audio.alias);
      audio.destroy();
    }else{
      audio.release();
    }
  }
  /**
   * 销毁音乐
   * @param nick
   */
  public destroyAll(destroyAudio?: boolean) {
    this.mAudioMap.forEach((v,k) => {
      let c_d = destroyAudio;
      if(c_d == undefined){
        c_d = !!this.mAudioDestroy.get(k);
      }
      this.destroy(k,c_d);
    });
    this.mAudioMap.clear();
    this.mAudioDestroy.clear();
  }

  /**
   * 停止背景音乐
   * @param nick
   */
  public stop(nick: string) {
    let audio = this.get(nick);
    if (!audio) {
      return;
    }
    audio.stop();
  }
  /**
   * 停止背景音乐
   * @param nick
   */
  public stopAll() {
    this.mAudioMap.forEach((v) => {
      v.stop();
    });
  }
}
