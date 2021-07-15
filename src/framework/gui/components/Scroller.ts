import { Component } from "../../core/Component";
import { ScrollBar, ScrollBarType } from "./ScrollBar";
import { EventManager } from "../../event/EventManager";
import { TweenManager } from "../../tween/TweenManager";
import { Tween } from "../../tween/Tween";
import { EventPoint } from "../utils/EventPoint";
import { Easing } from "../../tween/Easing";
import { Graphics, Container, DisplayObject, Point } from "pixi.js";
/**
 * Scroller 滑动控件
 */
export class Scroller extends Component {
  public static SCROLLTYPE = {
    VERTICLE: "VERTICLE",
    HORIZONTAL: "HORIZONTAL",
    ALL: "ALL",
  };

  protected _maskUI: Graphics;
  public scrollType = Scroller.SCROLLTYPE.VERTICLE;
  protected isTouchStart = false;
  protected anchorComponent: Component;
  protected contentContainer: Component;
  protected startTouchX: number;
  protected startTouchY: number;
  protected lastTouchX: number;
  protected lastTouchY: number;
  protected _height: number = 0;
  protected _width: number = 0;
  protected _contentHeight: number = 0;
  protected _contentWidth: number = 0;
  protected _scrollCallback: Function;
  protected _isScroll: boolean;
  protected _inertia: boolean = true;
  protected _verticleScrollBar: ScrollBar;
  protected _horizontalScrollBar: ScrollBar;
  protected _tween: Tween | null = null;
  protected _anchor: EventPoint;
  protected _x: number = 0;
  protected _y: number = 0;
  public isVerticleScroll = true;
  public isHorizontalScroll = true;
  isMoveUp: boolean | undefined;
  isMoveLeft: boolean | undefined;
  startTouchTime: number = 0;
  constructor() {
    super();
    this.isScroll = true;

    this._anchor.on("chageX", () => {
      this.x = this.x;
    });
    this._anchor.on("chageY", () => {
      this.y = this.y;
    });
  }
  /**
   * 绘制contentContainer  和 遮罩
   */
  draw() {

    if (!this._anchor) {
      this._anchor = new EventPoint();
    }
    if (!this._maskUI) {
      this._maskUI = new Graphics();
      super.addChild(this._maskUI);
      this.mask = this._maskUI;
    }
    if (!this.contentContainer) {
      this.anchorComponent = new Component();
      super.addChild(this.anchorComponent);
      this.contentContainer = new Component();
      this.anchorComponent.addChild(this.contentContainer);
    }
    this._maskUI.clear();
    this._maskUI.beginFill();
    this._maskUI.drawRect(
      -this.width * this.anchor.x + this.x,
      -this.height * this.anchor.y + this.y,
      this.width,
      this.height
    );
    if (this.horizontalScrollBar) {
      this.horizontalScrollBar.scrollHeight = this.height;
      this.horizontalScrollBar.scrollWidth = this.width;
      this.horizontalScrollBar.scrollContentHeight = this.contentHeight;
      this.horizontalScrollBar.scrollContentWidth = this.contentWidth;
    }
    if (this.verticleScrollBar) {
      this.verticleScrollBar.scrollHeight = this.height;
      this.verticleScrollBar.scrollWidth = this.width;
      this.verticleScrollBar.scrollContentHeight = this.contentHeight;
      this.verticleScrollBar.scrollContentWidth = this.contentWidth;
    }
  }

  /**
   * 事件处理
   */
  handleEvents() {
    this.on(EventManager.ALL_START, this.startTouch.bind(this));
    this.on(EventManager.ALL_MOVE, this.moveTouch.bind(this));
    this.on(EventManager.ALL_CANCEL, this.endTouch.bind(this));
    this.on(EventManager.ALL_END, this.endTouch.bind(this));
  }

  startTouch(event: PIXI.interaction.InteractionEvent) {
    if (!this.isScroll) return;
    this.isMoveUp = undefined;
    if (this._tween) {
      this._tween.stop();
      this._tween.remove();
      this._tween = null;
    }
    this.isTouchStart = true;
    this.startTouchX = this.toLocal(event.data.global).x;
    this.startTouchY = this.toLocal(event.data.global).y;
    this.lastTouchX = this.startTouchX;
    this.lastTouchY = this.startTouchY;
    this.startTouchTime = Date.now();
    this.emit("startTouch", event);
  }

  moveTouch(event: PIXI.interaction.InteractionEvent) {
    if (!this.isScroll) return;
    if (!this.isTouchStart) {
      return;
    }
    let touchX = this.toLocal(event.data.global).x;
    let touchY = this.toLocal(event.data.global).y;
    let offsetX = touchX - this.lastTouchX;
    let offsetY = touchY - this.lastTouchY;
    if (this.isMoveUp == undefined) {
      this.isMoveUp = offsetY < 0;
    } else if (this.isMoveUp != offsetY < 0) {
      this.isMoveUp = offsetY < 0;
      this.startTouchY = touchY;
    }
    if (this.isMoveLeft == undefined) {
      this.isMoveLeft = offsetX < 0;
    } else if (this.isMoveLeft != offsetX < 0) {
      this.isMoveLeft = offsetX < 0;
      this.startTouchX = touchX;
    }
    this.lastTouchX = touchX;
    this.lastTouchY = touchY;
    this.emit("moveTouch", event);
    this.scrollLayout(offsetX, offsetY);
  }
  endTouch(event: PIXI.interaction.InteractionEvent) {
    this.isTouchStart = false;
    if (
      !this.inertia ||
      this.isDestroy ||
      !this.parent ||
      this.parent.isDestroy
    ) {
      return;
    }
    this.emit("endTouch", event);
    let currTouchTime = Date.now();
    let touchX = this.toLocal(event.data.global).x;
    let touchY = this.toLocal(event.data.global).y;
    let distanceX = touchX - this.startTouchX;
    let distanceY = touchY - this.startTouchY;
    let time = currTouchTime - this.startTouchTime;
    let x: number | undefined = (distanceX / time) * 200;
    let y: number | undefined = (distanceY / time) * 200;
    if (this.scrollType == Scroller.SCROLLTYPE.VERTICLE) {
      x = undefined;
    } else if (this.scrollType == Scroller.SCROLLTYPE.HORIZONTAL) {
      y = undefined;
    }
    let maxDistance = 0;
    if (x != undefined && Math.abs(x) > maxDistance) {
      maxDistance = Math.abs(x);
    }
    if (y != undefined && Math.abs(y) > maxDistance) {
      maxDistance = Math.abs(y);
    }
    let dt = (maxDistance * time) / 70;
    if (dt < 300) {
      return;
    }
    this.scrollTween(
      x == undefined ? undefined : -(this.scrollX + x),
      y == undefined ? undefined : -(this.scrollY + y),
      dt
    );
  }
  /**
   * 设置 滑动回调
   * @param callback
   */
  setScrollCallback(callback: Function) {
    this._scrollCallback = callback;
  }
  /**
   * 滑动位置重绘
   * @param offsetX
   * @param offsetY
   */
  scrollLayout(offsetX: number, offsetY: number) {
    if (
      this.scrollType == Scroller.SCROLLTYPE.VERTICLE ||
      this.scrollType == Scroller.SCROLLTYPE.ALL
    ) {
      this.verticleScrollLayout(offsetY);
    }
    if (
      this.scrollType == Scroller.SCROLLTYPE.HORIZONTAL ||
      this.scrollType == Scroller.SCROLLTYPE.ALL
    ) {
      this.horizontalScrollLayout(offsetX);
    }
    //垂直的滑动进度
    let verticleScrollProgress = 1;
    let verticleSlidably = Math.abs(this.height - this.contentHeight);
    if (verticleSlidably > 0) {
      verticleScrollProgress =
        Math.abs(this.contentContainer.y) / verticleSlidably;
    }
    //水平的滑动进度
    let horizontalScrollProgress = 1;
    let horizontalSlidably = Math.abs(this.width - this.contentWidth);
    if (horizontalSlidably > 0) {
      horizontalScrollProgress =
        Math.abs(this.contentContainer.x) / horizontalSlidably;
    }
    if (this.verticleScrollBar) {
      this.verticleScrollBar.progress = verticleScrollProgress;
    }
    if (this.horizontalScrollBar) {
      this.horizontalScrollBar.progress = horizontalScrollProgress;
    }
    //滑动回调
    this._scrollCallback &&
      this._scrollCallback(
        offsetX,
        offsetY,
        verticleScrollProgress,
        horizontalScrollProgress,
        this.scrollType
      );
  }
  /**
   * 水平滑动  位置重绘
   * @param offsetX
   */
  horizontalScrollLayout(offsetX: number) {
    if (!this.isHorizontalScroll) return;
    // console.log(offsetX);
    let x = this.contentContainer.x + offsetX;
    let leftBorder = 0;
    let rightBorder = this.width - this.contentWidth;
    if (x < rightBorder) {
      x = rightBorder;
    }
    if (x > leftBorder) {
      x = leftBorder;
    }
    this.contentContainer.x = x;
    this.resetHorizontalScrollBarProgressView();
  }
  /**
   * 垂直滑动位置重绘
   * @param offsetY
   */
  verticleScrollLayout(offsetY: number) {
    if (!this.isVerticleScroll) return;
    let y = this.contentContainer.y + offsetY;
    let topBorder = 0;
    let bottomBorder = this.height - this.contentHeight;
    if (y < bottomBorder) {
      y = bottomBorder;
    }
    if (y > topBorder) {
      y = topBorder;
    }
    this.contentContainer.y = y;
    this.resetVerticleScrollBarProgressView();
  }

  /**
   * 是否可滑动
   */
  set isScroll(isScroll: boolean) {
    this._isScroll = isScroll;
  }
  /**
   * 滑动惯性
   */
  get inertia(): boolean {
    return this._inertia;
  }
  set inertia(inertia: boolean) {
    this._inertia = inertia;
  }
  get isScroll(): boolean {
    return this._isScroll;
  }
  set height(height: number) {
    this._height = height;
    this.y = this.y;
    this.draw();
  }
  get height(): number {
    return this._height;
  }
  set width(width: number) {
    this._width = width;
    this.x = this.x;
    this.draw();
  }
  get width(): number {
    return this._width;
  }
  /**
   * 直接滑动  Y 无动画
   */
  set scrollY(y: number) {
    this.stopTween();
    let offsetY = y - this.contentContainer.y;
    this.contentContainer.y = y;
    this.resetVerticleScrollBarProgressView();
    //滑动回调
    this._scrollCallback &&
    this._scrollCallback(
      0,
      offsetY,
      this.verticleScrollBar?.progress,
      this.horizontalScrollBar?.progress,
      this.scrollType
    );
    // this.draw();
  }
  get scrollY(): number {
    return this.contentContainer.y;
  }

  stopTween(){
    if (this._tween) {
      this._tween.stop();
      this._tween.remove();
      this._tween = null;
    }
  }
  /**
   * 执行滑动动画
   * @param x 滑动到指定X位置
   * @param y 滑动到指定Y位置
   * @param time 滑动时间
   * @param easing 使用的计算方式
   */
  scrollTween(
    x: number = this.scrollX,
    y: number = this.scrollY,
    time: number = 500,
    easing: Function = Easing.outQuint(),
    endcallback?: Function
  ) {
    if (x < 0) {
      x = 0;
    }
    if (y < 0) {
      y = 0;
    }
    if (x > this.contentWidth - this.width) {
      x = this.contentWidth - this.width;
    }
    // console.log("jjjjjj", y, this.contentHeight - this.height);
    if (y > this.contentHeight - this.height) {
      y = this.contentHeight - this.height;
    }
    x = -x;
    y = -y;
    let obj = {
      y: this.scrollY,
      x: this.scrollX,
    };
    let tween = TweenManager.builder(obj).to({
      y,
      x,
    });
    if (endcallback) {
      tween.on("end", endcallback);
    }
    tween.time(time);
    tween.easing(easing);
    tween.on("update", () => {
      let offsetY = obj.y - this.scrollY;
      let offsetX = obj.x - this.scrollX;
      this.scrollLayout(offsetX, offsetY);
    });
    tween.start();
    this._tween = tween;
  }

  /**
   * 直接滑动 X 无动画
   */
  set scrollX(x: number) {
    this.stopTween();
    let offsetX = x - this.contentContainer.x;
    this.contentContainer.x = x;
    this.resetHorizontalScrollBarProgressView();
    this._scrollCallback &&
    this._scrollCallback(
      offsetX,
      0,
      this.verticleScrollBar?.progress,
      this.horizontalScrollBar?.progress,
      this.scrollType
    );
    // this.draw();
  }
  get scrollX(): number {
    return this.contentContainer.x;
  }
  scrollTop() {
    this.stopTween();
    this.contentContainer.y = 0;
    this.resetVerticleScrollBarProgressView();
  }
  scrollLeft() {
    this.stopTween();
    this.contentContainer.x = 0;
    this.resetHorizontalScrollBarProgressView();
  }
  scrollBottom() {
    this.stopTween();
    let y = this.height - this.contentHeight;
    if (y > 0) {
      y = 0;
    }
    this.contentContainer.y = y;
    this.resetVerticleScrollBarProgressView();
  }
  scrollRight() {
    this.stopTween();
    let x = this.width - this.contentWidth;
    if (x > 0) {
      x = 0;
    }
    this.contentContainer.x = x;
    this.resetHorizontalScrollBarProgressView();
  }
  /**
   * 设置可滑动区域的高度
   */
  set contentHeight(height: number) {
    this._contentHeight = height;
    this.draw();
  }
  get contentHeight(): number {
    return this._contentHeight;
  }
  /**
   * 设置可滑动区域的宽度
   */
  set contentWidth(width: number) {
    this._contentWidth = width;
    this.draw();
  }
  get contentWidth(): number {
    return this._contentWidth;
  }
  resetVerticleScrollBarProgressView() {
    if (this.verticleScrollBar) {
      this.verticleScrollBar.progressView =
        Math.abs(this.contentContainer.y) / (this.contentHeight - this.height);
    }
  }
  resetHorizontalScrollBarProgressView() {
    if (this.horizontalScrollBar) {
      this.horizontalScrollBar.progressView =
        Math.abs(this.contentContainer.x) / (this.contentWidth - this.width);
    }
  }

  /**
   * 垂直的滑动条
   */
  set verticleScrollBar(scrollBar: ScrollBar) {
    if (this.verticleScrollBar == scrollBar) {
      return;
    }
    if (this.verticleScrollBar) {
      throw new Error("已经存在一个verticleScrollBar,无法再次添加");
    }
    this._verticleScrollBar = scrollBar;
    scrollBar.type = ScrollBarType.VERTICLE;
    scrollBar.bottom(0);
    scrollBar.right(0);
    scrollBar.zIndex = 100;
    scrollBar.scroller = this;
    this.anchorComponent.addChild(scrollBar);
    this.draw();
  }
  get verticleScrollBar(): ScrollBar {
    return this._verticleScrollBar;
  }
  /**
   * 水平的滑动条
   */
  set horizontalScrollBar(scrollBar: ScrollBar) {
    if (this.horizontalScrollBar == scrollBar) {
      return;
    }
    if (this.horizontalScrollBar) {
      throw new Error("已经存在一个horizontalScrollBar,无法再次添加");
    }
    this._horizontalScrollBar = scrollBar;
    scrollBar.type = ScrollBarType.HORIZONTAL;
    scrollBar.bottom(0);
    scrollBar.left(0);
    scrollBar.zIndex = 100;
    scrollBar.scroller = this;
    this.anchorComponent.addChild(scrollBar);
    this.draw();
  }
  get horizontalScrollBar(): ScrollBar {
    return this._horizontalScrollBar;
  }
  addChild(child: DisplayObject) {
    this.contentContainer.addChild(child);
  }
  addChildAt(child: DisplayObject, index: number) {
    this.contentContainer.addChildAt(child, index);
  }
  removeChild(child: DisplayObject) {
    this.contentContainer.removeChild(child);
  }
  removeChildAt(index: number) {
    this.contentContainer.removeChildAt(index);
  }
  set x(x: number) {
    this.anchorComponent.x = x - this.anchor.x * this.width;
    this._x = x;
    this.draw();
  }
  get x(): number {
    return this._x;
  }
  set y(y: number) {
    this.anchorComponent.y = y - this.anchor.y * this.height;
    this._y = y;
    this.draw();
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
  destroy(options?: {
    children?: boolean;
    texture?: boolean;
    baseTexture?: boolean;
  }) {
    if (this._tween) {
      this._tween.stop().remove();
    }
    if (this.horizontalScrollBar) {
      this.horizontalScrollBar.scroller = undefined;
    }
    if (this.verticleScrollBar) {
      this.verticleScrollBar.scroller = undefined;
    }
    super.destroy(options);
  }
}
