import { MultistateSprite } from "../MultistateSprite";
import { Texture } from "pixi.js";
import { Component } from "../../core/Component";
import { EventPoint } from "../utils/EventPoint";
/**
 * 多状态的Component
 */
export class MultistateComponent extends Component {
  protected rootComponent!: Component;
  protected rootSprite!: MultistateSprite;
  protected _normalTexture!: Texture;
  protected _disabledTexture!: Texture;
  currState: string = MultistateComponent.STATE.NORMAL;
  lastState!: string;
  protected _disabled: boolean = false;
  public static STATE = {
    NORMAL: "normal",
    DISABLED: "disabled"
  };
  protected _anchor!: EventPoint;
  protected _x: number = 0;
  protected _y: number = 0;
  
  constructor(options?: {
    normalTexture?: Texture;
    disabledTexture?: Texture;
    width?: number;
    height?: number;
  }) {
    super();
    
    if (options) {
      if (options.normalTexture) {
        this.normalTexture = options.normalTexture;
      }
      if (options.disabledTexture) {
        this.disabledTexture = options.disabledTexture;
      }
      if (options.width !== undefined) {
        this.width = options.width;
      }
      if (options.height !== undefined) {
        this.height = options.height;
      }
    }
    this._anchor.on("chageX", () => {
      this.x = this.x;
    });
    this._anchor.on("chageY", () => {
      this.y = this.y;
    });
  }
  /**
   * 未激活
   */
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(disabled: boolean) {
    this._disabled = disabled;
    this.interactive = !disabled;
  }
  /**
   * 绘制
   */
  draw() {
    if (!this._anchor) {
      this._anchor = new EventPoint();
    }
    if (!this.rootComponent) {
      this.rootComponent = new Component();
      this.addChild(this.rootComponent);
    }
    if (!this.rootSprite) {
      this.rootSprite = new MultistateSprite();
      this.rootComponent.addChild(this.rootSprite);
    }
    let currState = this.currState;
    if (this.disabled) {
      currState = MultistateComponent.STATE.DISABLED;
    }
    let has = this.rootSprite.hasState(currState);
    
    if (has) {
      this.rootSprite.setState(currState);
    }
  }
  /**
   * 设置当前状态
   * @param state 
   */
  setState(state: string){
    this.currState = state;
    this.draw();
  }
  /**
   * 状态是否存在
   * @param state 
   */
  hasState(state: string): boolean{
    return this.rootSprite.hasState(state)
  }
  /**
   * 添加状态
   * @param state 
   * @param texture 
   */
  addState(state: string, texture: Texture){
    this.rootSprite.addState(state, texture);
  }
  /**
   * 普通状态图片
   */
  set normalTexture(texture: Texture) {
    // if (texture == undefined || texture == this._normalTexture) {
    //   return;
    // }
    this.rootSprite.addState(MultistateComponent.STATE.NORMAL, texture);
    this._normalTexture = texture;
    this.draw();
    this.x = this.x;
    this.y = this.y;
  }
  get normalTexture(): Texture {
    return this._normalTexture;
  }
  /**
   * disabled 状态图片
   */
  set disabledTexture(texture: Texture) {
    this.rootSprite.addState(MultistateComponent.STATE.DISABLED, texture);
    this._disabledTexture = texture;
    this.draw();
    this.x = this.x;
    this.y = this.y;
  }
  get disabledTexture(): Texture {
    return this._disabledTexture;
  }
  set height(height: number) {
    this.rootSprite.height = height;
  }
  get height(): number {
    return this.rootSprite.height;
  }

  set width(width: number) {
    this.rootSprite.width = width;
  }
  get width(): number {
    return this.rootSprite.width;
  }
  set x(x: number) {
    this.rootComponent.x = x - this.anchor.x * this.width;
    this._x = x;
  }
  get x(): number {
    return this._x;
  }
  set y(y: number) {
    this.rootComponent.y = y - this.anchor.y * this.height;
    this._y = y;
  }
  get y(): number {
    return this._y;
  }

  set anchor(anchor: Point) {
    this._anchor = anchor;
    this.x = this.x;
    this.y = this.y;
  }
  get anchor(): Point {
    return this._anchor;
  }
}
