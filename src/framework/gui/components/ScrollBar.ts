import { Component } from "../../core/Component";
import { Scroller } from "./Scroller";
import { MultistateSprite } from "../MultistateSprite";
import { InteractionEvent, Texture } from "pixi.js";
import { Image } from "./Image";
import { Log } from "../../../framework/log/Log";
import { EventManager } from "../../../framework/event/EventManager";

export enum ScrollBarType {
  VERTICLE = 0,
  HORIZONTAL,
}

/**
 * ScrollBar 滑动控件的滑动条 跟 Scroller配合使用
 */
export class ScrollBar extends Component {
  protected rootComponent!: Component;
  protected sliderImage!: Image;
  protected backgroundImage!: Image;

  protected _padding: {
    top: {
      active: boolean;
      value: number;
    };
    bottom: {
      active: boolean;
      value: number;
    };
    left: {
      active: boolean;
      value: number;
    };
    right: {
      active: boolean;
      value: number;
    };
  };

  private _scrollHeight: number = 0;
  private _scrollWidth: number = 0;
  private _scrollContentHeight: number = 0;
  private _scrollContentWidth: number = 0;
  private _progress: number = 0;
  private _progressView: number = 0;
  private isTouch: boolean = false;
  private touchPosition!: PIXI.IPoint;
  private _type: ScrollBarType = 0;

  public scroller: Scroller | undefined;

  constructor(options?: { sliderTexture?: Texture }) {
    super();
    this.active;
    this._padding = {
      top: {
        active: true,
        value: 0,
      },
      bottom: {
        active: false,
        value: 0,
      },
      left: {
        active: false,
        value: 0,
      },
      right: {
        active: true,
        value: 0,
      },
    };
  }
  /**
   * 绘制图片
   */
  draw() {
    if (!this.rootComponent) {
      this.rootComponent = new Component();
      this.addChild(this.rootComponent);
    }

    if (!this.backgroundImage) {
      this.backgroundImage = new Image();
      this.backgroundImage.anchor.x = 0.5;
      this.rootComponent.addChild(this.backgroundImage);
    }

    if (!this.sliderImage) {
      this.sliderImage = new Image();
      this.sliderImage.on(EventManager.ALL_START, this.startTouch.bind(this));
      this.sliderImage.on(EventManager.ALL_MOVE, this.moveTouch.bind(this));
      this.sliderImage.on(EventManager.ALL_CANCEL, this.endTouch.bind(this));
      this.sliderImage.on(EventManager.ALL_END, this.endTouch.bind(this));
      this.sliderImage.anchor.x = 0.5;
      this.rootComponent.addChild(this.sliderImage);
    }
  }

  startTouch(event:InteractionEvent) {
    this.isTouch = true;
    this.touchPosition = this.toLocal(event.data.global);
    event.stopPropagation();
  }
  moveTouch(event:InteractionEvent) {
    if (!this.isTouch) {
      return;
    }
    event.stopPropagation();
    let position = this.toLocal(event.data.global);
    this.chageProgress(
      position.x - this.touchPosition.x,
      position.y - this.touchPosition.y
    );
    this.touchPosition = this.toLocal(event.data.global);
  }

  endTouch(event:InteractionEvent) {
    this.isTouch = false;
  }
  /**
   * 更改进度
   * @param x
   * @param y
   */
  chageProgress(x: number, y: number) {
    if (this.type == ScrollBarType.VERTICLE) {
      this.progress += y / (this.backgroundHeight - this.sliderHeight);
    } else {
      this.progress += x / (this.backgroundWidth - this.sliderWidth);
    }
    if (this.progress < 0) {
      this.progress = 0;
    } else if (this.progress > 1) {
      this.progress = 1;
    }
  }
  /**
   * 重新设置位置
   */
  relayout() {
    if (this.type == ScrollBarType.VERTICLE) {
      this.verticleLayout();
    } else {
      this.horizontalLayout();
    }
    if (this.scroller) {
      if (this.type == ScrollBarType.VERTICLE) {
        if (this.scroller.height - this.scroller.contentHeight >= 0) {
          this.rootComponent.active = false;
          return;
        }
        this.rootComponent.active = true;
      } else {
        if (this.scroller.width - this.scroller.contentWidth >= 0) {
          this.rootComponent.active = false;
          return;
        }
        this.rootComponent.active = true;
      }
    }
    this.sliderImage.y =
      (this.backgroundHeight - this.sliderHeight) * this.progressView;
  }

  /**
   * 垂直布局
   */
  verticleLayout() {
    this.backgroundImage.height = this.scrollHeight;
    let y = 0;
    if (this._padding.top.active) {
      y = this._padding.top.value;
    }
    if (this._padding.bottom.active) {
      y =
        this.backgroundHeight - this.scrollHeight - this._padding.bottom.value;
    }
    let x = 0;
    if (this._padding.left.active) {
      x = this._padding.left.value;
    }
    if (this._padding.right.active) {
      x = this.scrollWidth - this.backgroundWidth - this._padding.right.value;
    }
    this.rootComponent.x = x;
    this.rootComponent.y = y;
  }
  /**
   * 水平布局
   */
  horizontalLayout() {
    this.backgroundImage.width = this.scrollWidth;
    let y = 0;
    if (this._padding.top.active) {
      y = this._padding.top.value + this.backgroundWidth;
    }
    if (this._padding.bottom.active) {
      y =
        this.scrollHeight - this._padding.bottom.value - this.backgroundHeight;
    }
    let x = 0;
    if (this._padding.left.active) {
      x = this._padding.left.value;
    }
    if (this._padding.right.active) {
      x = this.scrollWidth - this.backgroundWidth - this._padding.right.value;
    }
    this.rootComponent.y = y;
    this.rootComponent.x = x;
  }


  /**
   * 滑块图片
   */
  set sliderTexture(texture: Texture) {
    this.sliderImage.texture = texture;
    this.relayout();
  }
  get sliderTexture(): Texture {
    return this.sliderImage.texture;
  }

  /**
   * 背景图片
   */
  set backgroundTexture(texture: Texture) {
    this.backgroundImage.texture = texture;
    this.relayout();
  }
  get backgroundTexture(): Texture {
    return this.backgroundImage.texture;
  }

  /**
   * scroll的高度
   */
  set scrollHeight(height: number) {
    this._scrollHeight = height;
    this.relayout();
  }
  get scrollHeight(): number {
    return this._scrollHeight;
  }
  /**
   * scroll的高度
   */
  set scrollWidth(height: number) {
    this._scrollWidth = height;
    this.relayout();
  }
  get scrollWidth(): number {
    return this._scrollWidth;
  }
  /**
   * scroll里面的view的高度
   */
  set scrollContentHeight(height: number) {
    this._scrollContentHeight = height;
    this.relayout();
  }
  get scrollContentHeight(): number {
    return this._scrollContentHeight;
  }
  /**
   * scroll里面的view的高度
   */
  set scrollContentWidth(width: number) {
    this._scrollContentWidth = width;
    this.relayout();
  }
  get scrollContentWidth(): number {
    return this._scrollContentWidth;
  }

  /**
   * 设置进度
   */
  set progress(progress: number) {
    this._progress = progress;
    if (this.scroller) {
      if (this.type == ScrollBarType.VERTICLE) {
        this.scroller.scrollY =
          (this.scroller.height - this.scroller.contentHeight) * progress;
      } else {
        this.scroller.scrollX =
        (this.scroller.width - this.scroller.contentWidth) * progress;
      }
    }

    this.emit("progress", progress);
  }
  get progress(): number {
    return this._progress;
  }

  /**
   * 设置进度的UI
   */
  set progressView(progressView: number) {
    this._progressView = progressView;
    this.relayout();
  }
  get progressView(): number {
    return this._progressView;
  }
  /**
   * 把控件设置到顶部
   */
  top(top: number) {
    this._padding.top.value = top;
    this._padding.top.active = true;
    this._padding.bottom.active = false;
    this.relayout();
  }

  /**
   * 把控件设置到底部
   */
  bottom(bottom: number) {
    this._padding.bottom.value = bottom;
    this._padding.bottom.active = true;
    this._padding.top.active = false;
    this.relayout();
  }
  /**
   * 把控件设置到左部
   */
  left(left: number) {
    this._padding.left.value = left;
    this._padding.left.active = true;
    this._padding.right.active = false;
    this.relayout();
  }
  /**
   * 把控件设置到右部
   */
  right(right: number) {
    this._padding.right.value = right;
    this._padding.right.active = true;
    this._padding.left.active = false;
    this.relayout();
  }

  /**
   * 背景宽度
   */
  set type(type: ScrollBarType) {
    this._type = type;
    this.relayout();
  }
  get type(): ScrollBarType {
    return this._type;
  }

  /**
   * 背景宽度
   */
  set backgroundWidth(width: number) {
      this.backgroundImage.width = width;
  }
  get backgroundWidth(): number {
      return this.backgroundImage.width;
  }
  /**
   * 背景高度
   */
  set backgroundHeight(height: number) {
      this.backgroundImage.height = height;
  }
  get backgroundHeight(): number {
      return this.backgroundImage.height;
  }
  /**
   * 滑块宽度
   */
  set sliderWidth(width: number) {
      this.sliderImage.width = width;
  }
  get sliderWidth(): number {
      return this.sliderImage.width;
  }
  /**
   * 滑块宽度
   */
  set sliderHeight(height: number) {
      this.sliderImage.height = height;
  }
  get sliderHeight(): number {
      return this.sliderImage.height;
  }
}
