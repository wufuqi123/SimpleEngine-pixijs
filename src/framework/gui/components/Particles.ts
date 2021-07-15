import { Component } from "../../core/Component";
import { Emitter } from "pixi-particles";
import { ParticleData } from "../../particles/ParticleData";
import { Log } from "../../log/Log";
import { Container } from "pixi.js";
export class Particles extends Component {
  protected mEmitter: Emitter;
  public repeat: number = 1;
  public endDestroy: boolean = false;
  protected currRepeat: number = 0;
  protected _isRun: boolean = false;
  protected _particleData: ParticleData;
  private runX: number = 0;
  private runY: number = 0;
  private _x: number = 0;
  private _y: number = 0;
  isChageOwnerPos!: boolean;
  mParticles: Container;
  constructor(particleData: ParticleData) {
    super();
    this._particleData = particleData;
    this.mParticles = new Container();
    this.mEmitter = new Emitter(
      this.mParticles,
      this._particleData.textureArr,
      this._particleData.emitterConfig
    );
    this.addChild(this.mParticles);
  }

  /**
   * 开始
   */
  start(repeat?: number) {
    if (repeat != undefined) {
      this.repeat = repeat;
    }
    if (this.repeat == 0) {
      return;
    }
    this.currRepeat = 1;
    this.mEmitter.cleanup();
    this.chageOwnerPos();
    this._isRun = true;
    this.mEmitter.init(
      this._particleData.textureArr,
      this._particleData.emitterConfig
    );
    this.mEmitter.emit = true;
    this.emit("start");
  }
  /**
   * 主循环
   */
  update = (deltaMS: number) => {
    if (!this.active || !this.isRun) {
      return;
    }
    this.onUpdate(deltaMS);
    this.mEmitter.update(deltaMS * 0.001);
    // Log.info("particleCount",this.mEmitter.particleCount)
    // if (this.isChageOwnerPos) {
    //   this.chageOwnerPos();
    // }
    if (
      this.mEmitter.particleCount == 0 &&
      (this.repeat - 1 >= this.currRepeat || this.repeat < 0)
    ) {
      this.emit("repeat");
      this.currRepeat++;
      this.mEmitter.cleanup();
      this.mEmitter.init(
        this._particleData.textureArr,
        this._particleData.emitterConfig
      );
    } else if (this.mEmitter.particleCount == 0) {
      this._isRun = false;
      this.emit("stop");
      this._endDestroy();
    }
  };
  private _endDestroy() {
    if (this.endDestroy) {
      this.removeFromParent();
      this.mEmitter.destroy();
      super.destroy();
    }
  }

  chageOwnerPos() {
    if (!this.isRun) {
      this.isChageOwnerPos = true;
      this.mParticles.x = this.x;
      this.mParticles.y = this.y;
      this.runX = this.x;
      this.runY = this.y;
      return;
    }
    this.mEmitter.updateOwnerPos(
      (this.x - this.runX) / this.scale.x,
      (this.y - this.runY) / this.scale.y
    );
    this.isChageOwnerPos = false;
  }

  set x(x: number) {
    this._x = x;
    this.chageOwnerPos();
  }
  get x(): number {
    return this._x;
  }
  set y(y: number) {
    this._y = y;
    this.chageOwnerPos();
  }
  get y(): number {
    return this._y;
  }
  /**
   * 停止
   */
  stop() {
    this.mEmitter.emit = false;
    this._isRun = false;
    this.mEmitter.cleanup();
    this.emit("stop");
    this._endDestroy();
  }

  /**
   * 暂停
   */
  pause() {
    this._isRun = false;
    this.emit("pause");
  }
  /**
   * 恢复
   */
  resume() {
    this._isRun = true;
    this.emit("resume");
  }

  get isRun(): boolean {
    return this._isRun;
  }

  destroy(options?: {
    children?: boolean;
    texture?: boolean;
    baseTexture?: boolean;
  }) {
    this.stop();
    this.mEmitter.destroy(options);
    super.destroy(options);
  }
}
