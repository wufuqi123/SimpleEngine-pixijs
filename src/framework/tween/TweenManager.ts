import { Tween } from "./Tween";
export class TweenManager {
  //Tween任务池
  private static tweens: Array<Tween> = [];
  //删除池
  private static tweensToDelete: Array<Tween> = [];
  //上一个时间
  private last: number = 0;

  protected static instance: TweenManager;
  public static getInstance() {
    if (!this.instance) {
      this.instance = new TweenManager();
    }
    return this.instance;
  }

  //创建 Tween
  public static builder(target: any): Tween {
    return TweenManager.getInstance().createTween(target);
  }

  public static update = (dt: number) => {
    // let deltaMS = this.getDeltaMS();
    let deltaMS = dt;
    for (let i = 0; i < TweenManager.tweens.length; i++) {
      let tween = TweenManager.tweens[i];
      if (tween.active) {
        tween.update(deltaMS);
      }
      if (tween.isEnded && tween.expire) {
        tween.remove();
      }
    }

    if (TweenManager.tweensToDelete.length) {
      for (let i = 0; i < TweenManager.tweensToDelete.length; i++)
        TweenManager.remove(TweenManager.tweensToDelete[i]);
      TweenManager.tweensToDelete.length = 0;
    }
  };
  //根据target找任务池里的tween
  getTweensForTarget(target: {}) {
    let tweens = [];
    for (let i = 0; i < TweenManager.tweens.length; i++) {
      if (TweenManager.tweens[i].target === target)
        tweens.push(TweenManager.tweens[i]);
    }

    return tweens;
  }
  //创建一个跟TweenManager 绑定的Tween
  createTween(target: {}): Tween {
    return new Tween(target, this);
  }
  //把Tween 添加到 任务池里
  addTween(tween: Tween) {
    tween.manager = this;
    TweenManager.tweens.push(tween);
  }
  //把Tween添加到 删除池里，下一帧删除
  removeTween(tween: Tween) {
    TweenManager.tweensToDelete.push(tween);
  }
  //删除任务池里的 Tween
  private static remove(tween: Tween) {
    TweenManager.tweens.remove(tween);
  }

  //获取当前  dt
  private getDeltaMS(): number {
    if (this.last === 0) this.last = Date.now();
    let now = Date.now();
    let deltaMS = now - this.last;
    this.last = now;
    return deltaMS;
  }
}
