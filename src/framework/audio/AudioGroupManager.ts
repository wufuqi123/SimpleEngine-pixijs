import { AudioContextGroupManager } from "./audiocontext/AudioContextGroupManager";
import { AudioType } from "./AudioType";
import { HTMLAudioGroupManager } from "./html/HTMLAudioGroupManager";
import { AudioGroupInterface } from "./interface/AudioGroupInterface";
import { AudioGroupManagerInterface } from "./interface/AudioGroupManagerInterface";
import { AudioInterface } from "./interface/AudioInterface";

/**
 * 音频组的管理类
 */
export class AudioGroupManager {
  private static mAGM: AudioGroupManagerInterface;

  /**
   * 要想使用声音，需要调用此函数初始化
   */
  public static init(useAudioType: AudioType) {
    this.mAGM = this.getAudioManager(useAudioType);
  }
  private static getAudioManager(useAudioType: AudioType): AudioGroupManagerInterface {
    switch (useAudioType) {
      case AudioType.AUDIO_CONTEXT:
        return AudioContextGroupManager.getInstance();
      case AudioType.HTML:
        return HTMLAudioGroupManager.getInstance();
    }
  }

  /**
   * 获取组
   * @param groupName 组名
   */
  public static getGroup(groupName: string): AudioGroupInterface {
    return this.mAGM.getGroup(groupName);
  }
  /**
   * 添加音频
   * @param audio
   */
  public static addAudio(audio: AudioInterface) {
    this.mAGM.addAudio(audio);
  }

  /**
   * 移除声音
   * @param audio
   */
  public static remove(audio: AudioInterface) {
    this.mAGM.remove(audio);
  }

  /**
   * 获取音频，groupName如果不填写则获取全部音频
   * @param groupName
   */
  public static getAudios(groupName?: string): Array<AudioInterface> {
    return this.mAGM.getAudios(groupName);
  }

  /**
   * 获取资源名，groupName如果不填写则获取全部资源名
   * @param groupName
   */
  public static getAlias(groupName?: string): Array<string> {
    return this.mAGM.getAlias(groupName);
  }

  /**
   * 资源是否存在,groupName如果不填写则在全部组里查询
   * @param alias
   * @param groupName
   */
  public static hasAlias(alias: string, groupName?: string): boolean {
    return this.mAGM.hasAlias(alias, groupName);
  }
}
