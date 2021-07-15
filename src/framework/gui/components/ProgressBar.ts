import { MultistateSprite } from "../MultistateSprite";
import { DisplayObject, Texture } from "pixi.js";
import { Component } from "../../core/Component";
import { EventPoint } from "../utils/EventPoint"
import { PlaneImage } from "./PlaneImage";
/**
 * 进度条
 */
export class ProgressBar extends Component {
  protected rootComponent!: Component;
  protected backgroundSprite!: MultistateSprite;
  protected progressSprite!: PlaneImage;
  protected _backgroundTexture!: Texture;
  protected _progressTexture!: Texture;
  protected _ProgressCallback!: Function;
  protected _progress: number = 0;
  protected _anchor!: EventPoint;
  protected _x: number = 0;
  protected _y: number = 0;

  constructor(options?: {
    backgroundTexture?: Texture;
    progressTexture?: Texture;
    width?: number;
    height?: number;
  }) {
    super();
    if (options) {
      if (options.backgroundTexture) {
        this.backgroundTexture = options.backgroundTexture;
      }
      if (options.progressTexture) {
        this.progressTexture = options.progressTexture;
      }
      if (options.width !== undefined) {
        this.width = options.width;
      }
      if (options.height !== undefined) {
        this.height = options.height;
      }
    }
    this.progress = 0;
    this._anchor.on("chageX", () => {
      this.x = this.x;
      this.emit("chageAnchor");
    });
    this._anchor.on("chageY", () => {
      this.y = this.y;
      this.emit("chageAnchor");
    });
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
    if (!this.progressSprite) {
      this.progressSprite = new PlaneImage();
      this.addChild(this.progressSprite);
    }
    this.backgroundSprite.setState();
    // this.progressSprite.setState();
  }
  /**
   * 背景图片
   */
  set backgroundTexture(texture: Texture) {
    this.backgroundSprite.setDefaultState(texture);
    this._backgroundTexture = texture;
    this.draw();
  }
  get backgroundTexture(): Texture {
    return this._backgroundTexture;
  }
  set backgroundColor(color: number | string) {
    this.backgroundSprite.color = color;

  }
  get backgroundColor(): number | string {
    return this.backgroundSprite.color;
  }
  /**
   * 进度图片
   */
  set progressTexture(texture: Texture) {
    // this.progressSprite.setDefaultState(texture);
    this.progressSprite.texture = texture;
    this._progressTexture = texture;
    this.width = this.width;
    this.height = this.height;
    // this.draw();
  }
  get progressTexture(): Texture {
    return this._progressTexture;
  }
  set progressColor(color: number | string) {
    this.progressSprite.color = color;

  }
  get progressColor(): number | string {
    return this.progressSprite.color;
  }


   /**
   * 左竖线的大小（A）
   */
  set leftWidth(leftWidth:number){
    this.progressSprite.leftWidth = leftWidth;
  }
  get leftWidth():number{
    return this.progressSprite.leftWidth;
  }
  /**
   * 顶部单杠的大小（C）
   */
  set topHeight(topHeight:number){
    this.progressSprite.topHeight = topHeight;
  }
  get topHeight():number{
    return this.progressSprite.topHeight;
  }
  /**
   * 右竖线的大小（B）
   */
  set rightWidth(rightWidth:number){
    this.progressSprite.rightWidth = rightWidth;
  }
  get rightWidth():number{
    return this.progressSprite.rightWidth;
  }
  /**
   * 底部单杠的大小（D）
   */
  set bottomHeight(bottomHeight:number){
    this.progressSprite.bottomHeight = bottomHeight;
  }
  get bottomHeight():number{
    return this.progressSprite.bottomHeight;
  }

  /**
   * 设置进度回调
   * @param callback 
   */
  setProgressCallback(callback: Function) {
    this._ProgressCallback = callback;
  }
  
  /**
   * 设置进度
   */
  set progress(progress: number) {
    this._progress = progress;
    this.setProgressLayout();
    this.emit("progress", progress);
    this._ProgressCallback && this._ProgressCallback(progress);
  }
  get progress(): number {
    return this._progress;
  }
  /**
   * 设置进度 UI
   */
  protected setProgressLayout() {
    this.progressSprite.width = this.width * this.progress;
  }
  getProgress() {
    return this.width * this.progress;
  }
  set height(height: number) {
    this.backgroundSprite.height = height;
    this.progressSprite.height = height;
    this.y = this.y;
  }
  get height(): number {
    return this.backgroundSprite.height;
  }
  set width(width: number) {
    this.backgroundSprite.width = width;
    this.x = this.x;
    this.setProgressLayout();
  }
  get width(): number {
    return this.backgroundSprite.width;
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
  /**
  * 添加元素
  */
  addChild(element: DisplayObject | Component) {
    this.rootComponent.addChild(element);
  }
  /**
   * 添加元素
   */
  addChildAt(element: DisplayObject | Component, index: number) {
    this.rootComponent.addChildAt(element, index);
  }
  removeChild(element: DisplayObject | Component) {
    this.rootComponent.removeChild(element);
  }
  removeChildAt(index: number) {
    this.rootComponent.removeChildAt(index);
  }
}
