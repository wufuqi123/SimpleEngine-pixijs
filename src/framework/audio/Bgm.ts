import { AudioComponent, EventManager, HTMLAudio, ResManager } from "../../framework";
// import { SaveInfo } from "../SaveInfo";
import { Audio } from "./Audio";
import { AudioInterface } from "./interface/AudioInterface";

/**
 * 背景音乐
 */
export class Bgm {
  private static DEFAULT_NICK = "default";

  private static mBgmAduio: Audio = new Audio();

  private static isInit: boolean = false;

  public static set volume(volume: number) {
    this.mBgmAduio.volume = volume;
  }
  public static get volume(): number {
    return this.mBgmAduio.volume;
  }

  public static set muted(muted: boolean) {
    this.mBgmAduio.muted = muted;
  }
  public static get muted(): boolean {
    return this.mBgmAduio.muted;
  }
  public static set mutedOffset(mutedOffset: boolean) {
    this.mBgmAduio.mutedOffset = mutedOffset;
  }
  public static get mutedOffset(): boolean {
    return this.mBgmAduio.mutedOffset;
  }

  public static get audioMap(): Map<string, AudioInterface> {
    return this.mBgmAduio.mAudioMap;
  }


  public static init(voiceVolume?: number, isOpenVoice?: boolean) {
    if (this.isInit) {
      return;
    }
    this.isInit = true;
    EventManager.on("背景音量改变", this.bgVolume.bind(this));
    // let userSetting = SaveInfo.getDataInfo("userSetting");
    // this.volume = userSetting.bgmVolume;
    // this.muted = userSetting.isOpenVoice;
    if (voiceVolume != undefined) {
      this.volume = voiceVolume;
    }
    if (isOpenVoice != undefined) {
      this.muted = isOpenVoice;
    }
  }
  public static bgVolume(volume: number) {
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
    endCallback?: () => void;
    count?: number;
    nick?: string;
  }): string {
    let res = data.res;
    // ResManager.removeResource(res);
    // data.endCallback && data.endCallback();
    // return ""
    let nick = data.nick || this.DEFAULT_NICK;
    let group = data.group || "bgm";
    let volume = data.volume == undefined ? 1 : data.volume;
    let muted = data.muted == undefined ? false : data.muted;
    let count = data.count == undefined ? -1 : data.count;
    let destroyAudio = !!data.destroyAudio;
    let endCallback = data.endCallback;
    return this.mBgmAduio.play({
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
    return this.mBgmAduio.get(nick || this.DEFAULT_NICK);
  }

  /**
   * 销毁音乐
   * @param nick
   */
  public static destroy(nick?: string, destroyAudio?: boolean) {
    this.mBgmAduio.destroy(nick || this.DEFAULT_NICK, destroyAudio);
  }

  // /**
  //  * 停止背景音乐
  //  * @param nick
  //  */
  // public static stop(nick?: string) {
  //   // this.destroy(nick);
  //   this.mBgmAduio.stop(nick || this.DEFAULT_NICK);
  // }
  /**
   * 销毁音乐
   * @param nick
   */
  public static destroyAll(destroyAudio?: boolean) {
    this.mBgmAduio.destroyAll(destroyAudio);
  }
  // /**
  //  * 销毁音乐
  //  * @param nick
  //  */
  // public static stopAll() {
  //   this.mBgmAduio.stopAll();
  // }
}
