import { AudioInterface } from "./AudioInterface";

/**
 * 音频组接口
 */
export interface AudioGroupInterface {
  name: string;
  /**
   * 音量
   */
  volume: number;
  /**
   * 是否静音
   */
  muted: boolean;
  /**
   * 获取当前组里的音频
   */
  getAudios(): Array<AudioInterface>;
  /**
   * 获取组里的资源名
   */
  getAlias(): Array<string>;
  /**
   * 资源在组里是否存在
   * @param alias 资源名
   */
  hasAlias(alias: string): boolean;
  /**
   * 移除音频
   * @param audio
   */
  remove(audio: AudioInterface): void;
  /**
   * 添加音频
   * @param audio
   */
  addAudio(audio: AudioInterface): void;
}
