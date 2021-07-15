import { Easing } from "./Easing";
import { TweenManager } from "./TweenManager";
import { EventEmitter } from "eventemitter3";
import { Log } from "../log/Log";
export class Tween extends EventEmitter {
  //要修改的对象
  public target: {};
  public manager: TweenManager | undefined;
  //执行的总时间
  private countTime: number = 0;
  //是否已激活状态
  public active: boolean = false;
  //使用的算法
  private easingProperty: Function = Easing.linear();
  //执行完一次后  是否从内存内清理出来
  public expire: boolean = false;
  //重复执行的次数，负数为无线循环
  private countRepeat: number = 0;
  //是否为循环
  private loop: boolean = false;
  //等待时间
  private delayProperty: number = 0;
  //是否为pingPong 效果
  private pingPongProperty: boolean = false;
  //是否已开启
  private isStarted: boolean = false;
  //是否已结束
  public isEnded: boolean = false;
  //是否调用了 start方法，用来判断restart回调
  private isUseStartFun: boolean = false;

  //要执行到某个值的参数容器
  private toData: {} | null = null;
  //从哪里开始的值，不写从target的原值开始
  private fromData: {} | null = null;
  //当前等待时间
  private currDelayTime: number = 0;
  //当前运行的时间
  private currElapsedTime: number = 0;
  //当前重复的次数
  private currRepeat: number = 0;
  //当前是不是PingPong
  private currPingPong: boolean = false;
  //扩展的Tween，当前的Tween执行完成后会立刻执行此扩展的Tween
  private chainTween: Tween | null = null;
  private _updateDeltaOffsetFun!:Function;
  constructor(target: {}, manager?: TweenManager) {
    super();
    this.target = target;
    if (manager) this.addTo(manager);
    this.clear();
  }
  //把当前Tween对象添加到  TweenManager 队列里去
  private addTo(manager: TweenManager) {
    this.manager = manager;
    this.manager.addTween(this);
    return this;
  }
  /**
   * 设置执行的总时间
   * @param time
   */
  public time(time: number) {
    this.countTime = time;
    return this;
  }
  /**
   * 设置使用的算法
   * @param easingProperty
   */
  public easing(easingProperty: Function) {
    this.easingProperty = easingProperty;
    return this;
  }
  /**
   * 设置pingPong
   * @param pingPong
   */
  public pingPong(pingPong: boolean) {
    this.pingPongProperty = pingPong;
    return this;
  }
  /**
   * 设置等待时间
   * @param delay
   */
  public delay(delay: number) {
    this.delayProperty = delay;
    return this;
  }
  /**
   * 负数 无线循环
   * @param repeat
   */
  public repeat(repeat: number) {
    if (repeat < 0) {
      this.loop = true;
    } else {
      this.loop = false;
    }
    this.countRepeat = repeat;
    return this;
  }
  /**
   * 扩展Tween，当前Tween执行完成之后会执行此扩展的Tween
   * @param tween
   */
  public chain(tween: Tween) {
    if (!tween) tween = new Tween(this.target);
    this.chainTween = tween;
    return tween;
  }
  /**
   * 开始动画
   */
  public start() {
    this.active = true;
    this.isUseStartFun = true;
    if(this.delayProperty <= 0 && this.countTime <= 0){
      this.setAllVal();
    }
    return this;
  }
  /**
   * 结束动画
   */
  public stop() {
    this.active = false;
    this.emit("stop");
    return this;
  }
  /**
   * 设置最终的值
   * @param data
   */
  public to(data: {}) {
    this.toData = data;
    return this;
  }
  /**
   * 设置最开始的值
   * @param data
   */
  public from(data: {}) {
    this.fromData = data;
    return this;
  }
  /**
   * 从任务队列里删除
   */
  public remove() {
    if (!this.manager) return this;
    this.manager.removeTween(this);
    return this;
  }

  /**
   * 设置为true则会从内存中清理出来，默认为false
   * Tween会只执行一次
   * @param expire
   */
  public setExpire(expire: boolean) {
    this.expire = expire;
    return this;
  }
  /**
   * 把Tween清空到初始化的地步，如果没有重新设置参数，start无法开启
   */
  public clear() {
    this.countTime = 0;
    this.active = false;
    this.easingProperty = Easing.linear();
    this.expire = false;
    this.countRepeat = 0;
    this.loop = false;
    this.delayProperty = 0;
    this.pingPongProperty = false;
    this.isStarted = false;
    this.isEnded = false;

    this.toData = null;
    this.fromData = null;
    this.currDelayTime = 0;
    this.currElapsedTime = 0;
    this.currRepeat = 0;
    this.currPingPong = false;

    this.chainTween = null;
    return this;
  }
  /**
   * 重置Tween，保留参数可以重新执行动画
   */
  public reset() {
    this.currElapsedTime = 0;
    this.currRepeat = 0;
    this.currDelayTime = 0;
    this.isStarted = false;
    this.isEnded = false;

    if (this.pingPongProperty && this.currPingPong) {
      let toData = this.toData;
      let fromData = this.fromData;
      this.toData = fromData;
      this.fromData = toData;

      this.currPingPong = false;
    }

    return this;
  }

  // 解析数据
  private parseData() {
    if (this.isStarted) return;

    if (!this.fromData) this.fromData = {};
    _parseRecursiveData(this.toData, this.fromData, this.target);
  }
  //设置参数
  private apply(time: number) {
    _recursiveApplyTween(
      this.toData,
      this.fromData,
      this.target,
      time,
      this.currElapsedTime,
      this.easingProperty
    );
  }
  //当前是否能执行  update
  private canUpdate() {
    return this.countTime && this.active && this.target;
  }
  //是否执行  定时器模块，不执行  后面的
  private canDeltaUpdate() {
    return this.countTime<=0 && this.delayProperty>0 && this.active && this.target;
  }

  //直接设置全部值
  setAllVal(){
    if (!this.isStarted) {
      this.parseData();
      this.isStarted = true;
      this.emit("start");
    } else {
      if (this.isUseStartFun) {
        this.emit("restart");
      }
    }
    this.isUseStartFun = false;
    this.emit("update", 0);
    if(this.pingPongProperty){
      this.emit("pingpong");
      this.emit("update", 0);
    }
    this.isEnded = true;
    this.active = false;
    //如果是  pingPong  则  不设置
    if(!this.pingPongProperty){
      
      this.currElapsedTime = 1;
      this.apply(1);
      if (this.chainTween && this.manager) {
        this.chainTween.addTo(this.manager);
        this.chainTween.start();
      }
    }
    this.emit("end");
  }

  setUpdateDeltaOffsetFun(updateDeltaOffsetFun:Function){
    this._updateDeltaOffsetFun = updateDeltaOffsetFun;
    return this;
  }

  update(deltaMS: number) {
    //如果设置了定时器
    if(this.canDeltaUpdate()){
      if (this.delayProperty > this.currDelayTime) {
        this.currDelayTime += deltaMS;
        return;
      }
      this.setAllVal();
      return;
    }
    if (!this.canUpdate() && this.toData) return;
    let toData, fromData;
    if(this._updateDeltaOffsetFun){
      deltaMS += this._updateDeltaOffsetFun(deltaMS);
    }
    if (this.delayProperty > this.currDelayTime) {
      this.currDelayTime += deltaMS;
      return;
    }
    // console.log(delta,deltaMS,this.currElapsedTime,this.countTime);
    if (!this.isStarted) {
      this.parseData();
      this.isStarted = true;
      this.emit("start");
    } else {
      if (this.isUseStartFun) {
        this.emit("restart");
      }
    }
    this.isUseStartFun = false;
    let time = this.pingPongProperty ? this.countTime / 2 : this.countTime;
    if (time > this.currElapsedTime) {
      let t = this.currElapsedTime + deltaMS;
      let ended = t >= time;

      this.currElapsedTime = ended ? time : t;
      this.apply(time);

      let realElapsed = this.currPingPong
        ? time + this.currElapsedTime
        : this.currElapsedTime;
      this.emit("update", realElapsed);

      if (ended) {
        if (this.pingPongProperty && !this.currPingPong) {
          this.currPingPong = true;
          toData = this.toData;
          fromData = this.fromData;
          this.fromData = toData;
          this.toData = fromData;

          this.emit("pingpong");
          this.currElapsedTime = 0;
          return;
        }

        if (this.loop || this.countRepeat > this.currRepeat) {
          this.currRepeat++;
          this.emit("repeat", this.currRepeat);
          this.currElapsedTime = 0;

          if (this.pingPongProperty && this.currPingPong) {
            toData = this.toData;
            fromData = this.fromData;
            this.toData = fromData;
            this.fromData = toData;

            this.currPingPong = false;
          }
          return;
        }

        this.isEnded = true;
        this.active = false;
        this.emit("end");

        if (this.chainTween && this.manager) {
          this.chainTween.addTo(this.manager);
          this.chainTween.start();
        }
      }
      return;
    }
  }
}

function _recursiveApplyTween(
  to: any,
  from: any,
  target: any,
  time: any,
  elapsed: any,
  easing: any
) {
  for (let k in to) {
    if (!_isObject(to[k])) {
      let b = from[k];
      let c = to[k] - from[k];
      let d = time;
      let t = elapsed / d;
      target[k] = b + c * easing(t);
    } else {
      _recursiveApplyTween(to[k], from[k], target[k], time, elapsed, easing);
    }
  }
}
function _parseRecursiveData(to: any, from: any, target: any) {
  for (let k in to) {
    if (from[k] !== 0 && !from[k]) {
      if (_isObject(target[k])) {

        if(from[k] == undefined){
          let obj:any = {};
          for(let key in to[k]){
            obj[key] = target[k][key];
          }
          from[k] = obj;
        }
        // Log.info(to[k], from[k], target[k]);
        _parseRecursiveData(to[k], from[k], target[k]);
      } else {
        from[k] = target[k];
      }
    }
  }
}
function _isObject(obj: any) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}
