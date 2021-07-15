import { AudioGroupInterface } from "../interface/AudioGroupInterface";
import { AudioInterface } from "../interface/AudioInterface";

export class AudioContextGroup implements AudioGroupInterface{
  private mAudioList:Array<AudioInterface> = new Array();
  private _volume: number = 1;
  private _muted: boolean = false;
  public name:string = "";

  /**
   * 设置此组的音量
   */
  public set volume(volume:number){
    this._volume = volume;
    this.mAudioList.forEach(v=>{
      v.volume = v.volume;
    });
  }

  public get volume():number{
    return this._volume;
  }

  /**
   * 组是否静音
   */
  public set muted(muted:boolean){
    this._muted = muted;
    this.mAudioList.forEach(v=>{
      v.muted = v.muted;
    });
  }
  public get muted():boolean{
    return this._muted;
  }

  /**
   * 获取当前组里的音频
   */
  public getAudios():Array<AudioInterface>{
    let arr = new Array();
    this.mAudioList.forEach(v=>{
      arr.push(v);
    })
    return arr;
  }

  /**
   * 获取组里的资源名
   */
  public getAlias():Array<string>{
    let arr = new Array();
    this.mAudioList.forEach(v=>{
      if(!arr.includes(v.alias)){
        arr.push(v.alias);
      }
    })
    return arr;
  }

  /**
   * 资源在组里是否存在
   * @param alias 资源名
   */
  public hasAlias(alias:string):boolean{
    return this.getAlias().includes(alias);
  }

  
  public remove(audio:AudioInterface){
    this.mAudioList.remove(audio);
  }
  public addAudio(audio:AudioInterface){
    if(!this.mAudioList.includes(audio)){
      this.mAudioList.push(audio);
    }
  }
}