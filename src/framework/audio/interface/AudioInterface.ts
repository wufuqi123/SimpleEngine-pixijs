/**
 * 音频接口
 */
export interface AudioInterface {
  EVENTS: {
    /**
     * 加载完成
     */
    LOADING_COMPLETED: string;
    /**
     * 请求数据时遇到错误
     */
    ERROR: string;
    /**
     * play()和autoplay开始播放时触发
     */
    PLAY: string;
    /**
     * stop()时触发
     */
    STOP: string;
    /**
     * resume()时触发
     */
    RESUME: string;

    /**
     * pause()触发
     */
    PAUSE: string;
    /**
     * 播放结束
     */
    ENDED: string;
    /**
     * 播放时间改变
     */
    TIMEUPDATE: string;
    /**
     * 播放速率改变
     */
    RETE_CHANGE: string;
    /**
     * 音量改变
     */
    VOLUME_CHANGE: string;
    /**
     * 静音改变
     */
    MUTED_CHANGE: string;

    /**
     * 释放
     */
    RELEASE: string;
    /**
     * 销毁
     */
    DESTROY: string;
  };

  /**
   * 资源名
   */
  readonly alias: string;

  /**
   * 音频组
   */
  group: string;
  /**
   * 当前播放的位置
   */
  currentTime: number;
  /**
   * 音频时长
   */
  duration: number;
  /**
   * 是否正在播放
   */
  isPlaying: boolean;
  /**
   * 循环
   */
  loop: boolean;
  /**
   * 是否暂停
   */
  isPause: boolean;
  /**
   * 是否释放
   */
  isRelease: boolean;
  /**
   * 是否销毁
   */
  isDestroy: boolean;
  /**
   * 额外参数
   */
  paramData: any;

  /**
   * 当前音频的真实速度
   */
  readonly realSpeed: number;
  /**
   * 当前音频的真实音量
   */
  readonly realVolume: number;
  /**
   * 当前音频的真实静音情况
   */
  readonly realMuted: boolean;

  /**
   * 组的音量
   */
  readonly groupVolume: number;
  /**
   * 音量
   */
  volume: number;
  /**
   * 动画音量
   */
  aminVolume: number;
  /**
   * 偏移音量
   */
  offsetVolume: number;
  /**
   * 组是否静音
   */
  readonly groupMuted: boolean;
  /**
   * 是否静音
   */
  muted: boolean;
  /**
   * 偏移是否静音
   */
  offsetMuted: boolean;
  /**
   * 速度
   */
  speed: number;

  /**
   * 是否播放完成
   */
  readonly isEnded: boolean;
  update:(dt:number)=>void;

  /**
   * 将当前频率数据复制到Uint8Array传递给它的（无符号字节数组）中。
   * @param array 
   */
  getByteFrequencyData(array: Uint8Array): void;
  /**
   * 将当前波形或时域数据复制到Uint8Array传递给它的（无符号字节数组）中。
   * @param array 
   */
  getByteTimeDomainData(array: Uint8Array): void;
  /**
   * 将当前频率数据复制到Float32Array传递给它的数组中。
   * @param array 
   */
  getFloatFrequencyData(array: Float32Array): void;
  /**
   * 将当前波形或时域数据复制到Float32Array传递给它的数组中。
   * @param array 
   */
  getFloatTimeDomainData(array: Float32Array): void;
  /**
   * 初始化 音频
   */
  init(): void;

  /**
   * 播放
   */
  play(): void;

  /**
   * 停止
   */
  stop(): void;

  /**
   * 恢复声音
   */
  resume(): void;

  /**
   * 暂停
   */
  pause(): void;

  /**
   * 音量fadeIn动画
   * @param time 动画时间
   * @param callback 执行完成回调
   */
  fadeIn(time: number, callback?: () => void): void;

  /**
   * 音量fadeOut动画
   * @param time 动画时间
   * @param callback 执行完成回调
   */
  fadeOut(time: number, callback?: () => void): void;
  /**
   * 音量fadeTo动画
   * @param time 动画时间
   * @param volume 执行到的音量，只能填写[0-1]
   * @param callback 执行完成回调
   */
  fadeTo(time: number, volume: number, callback?: () => void): void;

  /**
   * 移除事件
   */
  removeEvents(): void;
  /**
   * 加载资源
   * @param callback 加载完成后回调
   */
  load(callback?: () => void): void;
  /**
   * 释放
   */
  release(): void;
  /**
   * 销毁
   */
  destroy(): void;
  /**
   * 发送事件
   */
  emit(event: any, ...args: Array<any>): boolean;
  /**
   * 添加事件
   */
  on(event: any, fn: Function, context?: any): this;
  /**
   * 添加一次事件
   * @param event
   * @param fn
   * @param context
   */
  once(event: any, fn: Function, context?: any): this;
  /**
   * 移除事件
   * @param event
   * @param fn
   * @param context
   * @param once
   */
  off(event: any, fn?: Function, context?: any, once?: boolean): this;

  /**
   * 获取当前注册的事件名
   */
  eventNames(): Array<any>;
}
