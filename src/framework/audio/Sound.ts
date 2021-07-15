import { AudioComponent, AudioManager, EventManager, HTMLAudio, UUIDUtils } from "../../framework";
// import { SaveInfo } from "../SaveInfo";
import { Audio } from "./Audio";
import { AudioInterface } from "./interface/AudioInterface";

/**
 * 音效
 */
export class Sound {
  private static mSoundAduio: Audio = new Audio();
  private static isInit: boolean = false;

  public static set volume(volume: number) {
    this.mSoundAduio.volume = volume;
  }
  public static get volume(): number {
    return this.mSoundAduio.volume;
  }
  public static set muted(muted: boolean) {
    this.mSoundAduio.muted = muted;
  }
  public static get muted(): boolean {
    return this.mSoundAduio.muted;
  }
  public static set mutedOffset(mutedOffset: boolean) {
    this.mSoundAduio.mutedOffset = mutedOffset;
  }
  public static get mutedOffset(): boolean {
    return this.mSoundAduio.mutedOffset;
  }

  public static get audioMap(): Map<string, AudioInterface>{
    return this.mSoundAduio.mAudioMap;
  }

  public static init(voiceVolume?:number,isOpenVoice?:boolean) {
    if (this.isInit) {
      return;
    }
    this.isInit = true;
    EventManager.on("音效音量改变", this.soundVolume.bind(this));
    // let userSetting = SaveInfo.getDataInfo("userSetting");
    // this.volume = userSetting.soundVolume;
    // this.muted = userSetting.isOpenVoice;
    if(voiceVolume!=undefined){
      this.volume = voiceVolume;
    }
    if(isOpenVoice!=undefined){
      this.muted = isOpenVoice;
    }
  }
  public static soundVolume(volume: number) {
    this.volume = volume;
  }

  /**
   * 播放音效
   * @param data
   */
  public static play(data: {
    res: string;
    volume?: number;
    muted?: boolean;
    group?: string;
    destroyAudio?: boolean;
    endCallback?: ()=>void;
    count?: number;
    nick?: string;
  }): string {
    if(AudioManager.isGlobalPause || AudioManager.isOffsetPause){
      return "";
    }
    let res = data.res;
    let nick = data.nick || UUIDUtils.getUUID();
    let group = data.group || "sound";
    let volume = data.volume == undefined ? 1 : data.volume;
    let muted = data.muted == undefined ? false : data.muted;
    let count = data.count == undefined ? 1 : data.count;
    let destroyAudio = !!data.destroyAudio;
    let endCallback = data.endCallback;

    return this.mSoundAduio.play({
      res,
      volume,
      group,
      muted,
      destroyAudio,
      count,
      endCallback,
      nick,
    });
  }

  /**
   * 获取正在播放的
   * @param nick
   */
  public static get(nick: string): AudioInterface | undefined {
    return this.mSoundAduio.get(nick);
  }

  /**
   * 销毁音乐
   * @param nick
   */
  public static destroy(nick: string, destroyAudio?: boolean) {
    this.mSoundAduio.destroy(nick, destroyAudio);
  }
  /**
   * 销毁音乐
   * @param nick
   */
  public static destroyAll(destroyAudio?: boolean) {
    this.mSoundAduio.destroyAll(destroyAudio);
  }
  // /**
  //  * 销毁音乐
  //  * @param nick
  //  */
  // public static stopAll() {
  //   this.mSoundAduio.stopAll();
  // }

  // /**
  //  * 停止背景音乐
  //  * @param nick
  //  */
  // public static stop(nick: string) {
  //   this.mSoundAduio.stop(nick);
  // }
}
