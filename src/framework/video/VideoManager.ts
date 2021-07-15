import { VideoLoader } from "./VideoLoader";
import { ResManager } from "../core/ResManager";
import { VideoComponent } from "./VideoComponent";
export class VideoManager {
  public static videoContainer: HTMLElement;
  private static mVideoArray: Array<VideoComponent> = new Array();
  private static _globalVolume: number = 1;
  private static _globalSpeed: number = 1;
  private static _globalMuted: boolean = false;
  public static isGlobalPause: boolean = false;
  public static isOffsetPause: boolean = false;

  public static init() {
    ResManager.resLoader.use(VideoLoader.use);
  }

  /**
   * 全局音量
   *
   * 编辑人：吴富其
   * 时间  ：2021-01-14 创建
   */
  public static set globalVolume(globalVolume: number) {
    this._globalVolume = globalVolume;
    this.mVideoArray.forEach((video) => {
      video.volume = video.volume;
    });
  }
  public static get globalVolume(): number {
    return this._globalVolume;
  }

  /**
   * 全局静音
   *
   * 编辑人：吴富其
   * 时间  ：2021-01-14 创建
   */
  public static set globalMuted(globalMuted: boolean) {
    this._globalMuted = globalMuted;
    this.mVideoArray.forEach((video) => {
      video.muted = video.muted;
    });
  }
  public static get globalMuted(): boolean {
    return this._globalMuted;
  }

  /**
   * 全局速度
   *
   * 编辑人：吴富其
   * 时间  ：2021-01-14 创建
   */
  public static set globalSpeed(globalSpeed: number) {
    this._globalSpeed = globalSpeed;
    this.mVideoArray.forEach((video) => {
      video.speed = video.speed;
    });
  }
  public static get globalSpeed(): number {
    return this._globalSpeed;
  }

  /**
   * 使所有视频静音。
   */
  public static muteAll() {
    this.globalMuted = true;
  }
  /**
   * 使所有视频静音恢复。
   */
  public static unmuteAll() {
    this.globalMuted = false;
  }



  /**
   * 暂停任何播放声音。
   */
  public static pauseAll() {
    if (this.isOffsetPause) {
      return;
    }
    this.isOffsetPause = true;
    this.mVideoArray.forEach((video) => {
        video._globalPause();
    });
  }
  /**
   * 恢复任何播放声音。
   */
  public static resumeAll() {
    if (!this.isOffsetPause) {
      return;
    }
    this.isOffsetPause = false;
    this.mVideoArray.forEach((video) => {
      video._globalResume();
    });
  }

    /**
   * 暂停任何播放声音。
   */
  public static globalPause() {
    if (this.isGlobalPause) {
      return;
    }
    this.isGlobalPause = true;
    this.mVideoArray.forEach((video) => {
        video._globalPause();
    });
  }
  /**
   * 恢复任何播放声音。
   */
  public static globalResume() {
    if (!this.isGlobalPause) {
      return;
    }
    this.isGlobalPause = false;
    this.mVideoArray.forEach((video) => {
        video._globalResume();
    });
  }

  /**
   * 把video  添加到  VideoManager里
   * 便于VideoManager管理
   *
   * 编辑人：吴富其
   * 时间  ：2021-01-14 创建
   * @param video
   */
  public static push(video: VideoComponent) {
    if (!VideoManager.has(video)) {
      VideoManager.mVideoArray.push(video);
    }
  }

  /**
   * 把video  是否在  VideoManager里
   *
   * 编辑人：吴富其
   * 时间  ：2021-01-14 创建
   * @param video
   */
  public static has(video: VideoComponent): boolean {
    return VideoManager.mVideoArray.includes(video);
  }

  /**
   * 把video 从  VideoManager里移除
   *
   * 编辑人：吴富其
   * 时间  ：2021-01-14 创建
   * @param video
   */
  public static remove(video: VideoComponent) {
    VideoManager.mVideoArray.remove(video);
  }
}
