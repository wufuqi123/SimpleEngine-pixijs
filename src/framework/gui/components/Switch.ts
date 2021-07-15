import { MultistateSprite } from "../MultistateSprite";
import { Texture } from "pixi.js";
import { EventManager } from "../../event/EventManager";
import { Component } from "../../core/Component";
import { EventPoint } from "../utils/EventPoint";
/**
 * 开关
 */
export class Switch extends Component {
  protected backgroundSprite: MultistateSprite;
  protected sliderSprite: MultistateSprite;
  protected _backgroundTexture: Texture;
  protected _sliderTexture: Texture;
  protected _selected: boolean;
  protected _chageCallback: Function | undefined;
  private _sliderY: number;
  private _sliderX: number;
  private _backgroundSelectedTexture: Texture;
  private _sliderSelectedTexture: Texture;
  protected  _anchor: EventPoint;
  rootComponent: Component;
  private _x: number;
  private _y: number;
  constructor(options?: {
    backgroundTexture?: Texture;
    sliderTexture?: Texture;
    width?: number;
    height?: number;
  }) {
    super();
    if (options) {
      if (options.backgroundTexture) {
        this.backgroundTexture = options.backgroundTexture;
      }
      if (options.sliderTexture) {
        this.sliderTexture = options.sliderTexture;
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
    this.x = 0;
    this.y = 0;
    this.sliderX = 0;
    this.sliderY = 0;
    this.buttonMode = true;
  }
  /**
   * 设置事件
   */
  handleEvents() {
    this.on(EventManager.ALL_CLICK, () => {
      this.selected = !this.selected;
    });
  }
  /**
   * 改变回调
   * @param callback
   */
  setChageCallback(callback: Function) {
    this._chageCallback = callback;
  }
  /**
   * 是否选中
   */
  set selected(selected: boolean) {
    if (this._selected == selected) {
      return;
    }
    this._selected = selected;
    this.chageLayuot();
    this.chageView();
   
    this.emit("selected",selected);
    if (this._chageCallback) {
      this._chageCallback(selected);
    }
  }
  get selected(): boolean {
    return this._selected;
  }
  /**
   * 更改位置
   */
  chageLayuot() {
    this.sliderX = this.sliderX;
  }
  /**
   * 更改渲染
   */
  chageView(){
    this.backgroundSprite.setState(this.selected ? "selected" : "default");
    this.sliderSprite.setState(this.selected ? "selected" : "default");
  }
  /**
   * 绘制图片
   */
  draw() {
    if (!this._anchor) {
      this._anchor = new EventPoint();
    }
    if (!this.rootComponent) {
      this.rootComponent = new Component();
      super.addChild(this.rootComponent);
    }
    if (!this.backgroundSprite) {
      this.backgroundSprite = new MultistateSprite();
      this.addChild(this.backgroundSprite);
    }
    if (!this.sliderSprite) {
      this.sliderSprite = new MultistateSprite();
      this.sliderSprite.anchor.set(0, 0.5);
      this.addChild(this.sliderSprite);
    }
    this.backgroundSprite.setState();
    this.sliderSprite.setState();
  }
  /**
   * 默认背景图片
   */
  set backgroundTexture(texture: Texture) {
    this.backgroundSprite.setDefaultState(texture);
    this._backgroundTexture = texture;
    this.draw();
    this.width = texture.width;
    this.height = texture.height;
  }
  get backgroundTexture(): Texture {
    return this._backgroundTexture;
  }
  /**
   * 背景选中图片
   */
  set backgroundSelectedTexture(texture: Texture) {
    this.backgroundSprite.addState("selected", texture);
    this._backgroundSelectedTexture = texture;
    this.draw();
    this.width = texture.width;
    this.height = texture.height;
  }
  get backgroundSelectedTexture(): Texture {
    return this._backgroundSelectedTexture;
  }
  /**
   * 滑动块  图片
   */
  set sliderTexture(texture: Texture) {
    this.sliderSprite.setDefaultState(texture);
    this._sliderTexture = texture;
    this.draw();
    this.sliderWidth = texture.width;
    this.sliderHeight = texture.height;
  }
  get sliderTexture(): Texture {
    return this._sliderTexture;
  }
  /**
   * 滑动块 选中 图片
   */
  set sliderSelectedTexture(texture: Texture) {
    this.sliderSprite.addState("selected", texture);
    this._sliderSelectedTexture = texture;
    this.draw();
    this.sliderWidth = texture.width;
    this.sliderHeight = texture.height;
  }
  get sliderSelectedTexture(): Texture {
    return this._sliderSelectedTexture;
  }

  set height(height: number) {
    this.backgroundSprite.height = height;
    this.sliderY = this.sliderY;
    this.y = this.y;
  }
  get height(): number {
    return this.backgroundSprite.height;
  }
  set width(width: number) {
    this.backgroundSprite.width = width;
    this.sliderX = this.sliderX;
    this.x = this.x;
  }
  get width(): number {
    return this.backgroundSprite.width;
  }

  set sliderHeight(height: number) {
    this.sliderSprite.height = height;
    this.sliderY = this.sliderY;
  }
  get sliderHeight(): number {
    return this.sliderSprite.height;
  }
  set sliderWidth(width: number) {
    this.sliderSprite.width = width;
    this.sliderX = this.sliderX;
  }
  get sliderWidth(): number {
    return this.sliderSprite.width;
  }

  set sliderY(y: number) {
    this._sliderY = y;
    this.sliderSprite.y = this.height / 2 + y;
  }
  get sliderY(): number {
    return this._sliderY;
  }
  set sliderX(x: number) {
    this._sliderX = x;
    this.sliderSprite.x = this.selected ? this.width - this.sliderWidth + x : x;
  }
  get sliderX(): number {
    return this._sliderX;
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

  addChild(child: DisplayObject | Component) {
    this.rootComponent.addChild(child);
  }
  addChildAt(child: DisplayObject | Component, index: number) {
    this.rootComponent.addChildAt(child, index);
  }
  removeChild(child: DisplayObject | Component) {
    this.rootComponent.removeChild(child);
  }
  removeChildAt(index: number) {
    this.rootComponent.removeChildAt(index);
  }
  removeAllChild() {
    for (let i = 0; i < this.children.length; i++) {
      this.rootComponent.removeChildAt(i);
      i--;
    }
  }
}
