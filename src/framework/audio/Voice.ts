import { AudioComponent, AudioManager, EventManager, HTMLAudio, ResManager } from "../../framework";
import { Log } from "../log/Log";
// import { SaveInfo } from "../SaveInfo";
import { Audio } from "./Audio";
import { AudioInterface } from "./interface/AudioInterface";

/**
 * 音效
 */
export class Voice {
  private static DEFAULT_NICK = "default";

  private static mVoiceAduio: Audio = new Audio();
  private static isInit: boolean = false;

  public static set volume(volume: number) {
    this.mVoiceAduio.volume = volume;
  }
  public static get volume(): number {
    return this.mVoiceAduio.volume;
  }
  public static set muted(muted: boolean) {
    this.mVoiceAduio.muted = muted;
  }
  public static get muted(): boolean {
    return this.mVoiceAduio.muted;
  }
  public static set mutedOffset(mutedOffset: boolean) {
    this.mVoiceAduio.mutedOffset = mutedOffset;
  }
  public static get mutedOffset(): boolean {
    return this.mVoiceAduio.mutedOffset;
  }

  public static get audioMap(): Map<string, AudioInterface> {
    return this.mVoiceAduio.mAudioMap;
  }

  public static init(voiceVolume: number, isOpenVoice: boolean) {
    if (this.isInit) {
      return;
    }
    this.isInit = true;
    EventManager.on("配音音量改变", this.voiceVolume.bind(this));
    this.mVoiceAduio.on("end", this.end.bind(this));
    // // let userSetting = SaveInfo.getDataInfo("userSetting");
    // this.volume = userSetting.voiceVolume;
    // this.muted = userSetting.isOpenVoice;
    if (!voiceVolume) {
      throw new Error("----------------------");
    }

    if (voiceVolume != undefined) {
      this.volume = voiceVolume;
    }
    if (isOpenVoice != undefined) {
      this.muted = isOpenVoice;
    }
  }
  public static voiceVolume(volume: number) {
    this.volume = volume;
  }
  private static end(nick: string) {
    this.mVoiceAduio.destroy(nick);
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
    isRemove?: boolean;
    count?: number;
    endCallback?: () => void;
    nick?: string;
  }): string {
    let res = data.res;
    let nick = data.nick || this.DEFAULT_NICK;
    let group = data.group || "voice";
    Log.info("删除资源----",res,data.isRemove)
    if (
      AudioManager.isGlobalPause || AudioManager.isOffsetPause || data.isRemove
    ) {
      ResManager.removeResource(res);
      data.endCallback && data.endCallback();
      return "";
    }
    let volume = data.volume == undefined ? 1 : data.volume;
    let muted = data.muted == undefined ? false : data.muted;
    let count = data.count == undefined ? 1 : data.count;
    if(data.destroyAudio == undefined){
      data.destroyAudio = true;
    }
    let destroyAudio = !!data.destroyAudio;
    let endCallback = data.endCallback;

    return this.mVoiceAduio.play({
      res,
      volume,
      muted,
      group,
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
  public static get(nick?: string): AudioInterface | undefined {
    return this.mVoiceAduio.get(nick || this.DEFAULT_NICK);
  }

  /**
   * 销毁音乐
   * @param nick
   */
  public static destroy(nick?: string, destroyAudio?: boolean) {
    this.mVoiceAduio.destroy(nick || this.DEFAULT_NICK, destroyAudio);
  }

  /**
   * 停止背景音乐
   * @param nick
   */
  public static stop(nick?: string) {
    this.mVoiceAduio.stop(nick || this.DEFAULT_NICK);
  }
  /**
   * 销毁音乐
   * @param nick
   */
  public static destroyAll(destroyAudio?: boolean) {
    this.mVoiceAduio.destroyAll(destroyAudio);
  }
  // /**
  //  * 销毁音乐
  //  * @param nick
  //  */
  // public static stopAll() {
  //   this.mVoiceAduio.stopAll();
  // }
}
