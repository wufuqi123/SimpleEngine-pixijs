import { MultistateSprite } from "../MultistateSprite";
import { EventManager } from "../../event/EventManager";
import { Texture } from "pixi.js";
import { ProgressBar } from "./ProgressBar";
import { Log } from "../../log/Log";
//滑动块
export class Slider extends ProgressBar {
  public static SLIDER_END:string = "slider_end";
  protected sliderSprite: MultistateSprite;
  protected _sliderTexture: Texture;
  protected isTouchStart = false;
  protected startTouchX: number;
  protected lastTouchX: number;

  constructor(options?: {
    backgroundTexture?: Texture;
    progressTexture?: Texture;
    sliderTexture?: Texture;
    width?: number;
    height?: number;
  }) {
    super(options);
    if (options) {
      if (options.sliderTexture) {
        this.sliderTexture = options.sliderTexture;
      }
    }
    this.buttonMode = true;
  }

  //事件处理
  handleEvents() {
    this.on(
      EventManager.ALL_START,
      (event: PIXI.interaction.InteractionEvent) => {
        this.isTouchStart = true;
        this.startTouchX = this.toLocal(event.data.global).x;
        let progress = this.backgroundSprite.toLocal(event.data.global).x/this.width;
        if(progress<0){
          progress = 0;
        }else if(progress>1){
          progress = 1;
        }
        if(!isNaN(progress)){
          this.progress = progress;
        }
        this.lastTouchX = this.startTouchX;
      }
    );

    this.on(
      EventManager.ALL_MOVE,
      (event: PIXI.interaction.InteractionEvent) => {
        if (!this.isTouchStart) {
          return;
        }
        let touchX = this.toLocal(event.data.global).x;
        let offsetX = touchX - this.lastTouchX;
        this.lastTouchX = touchX;
        let x = offsetX + this.sliderSprite.x;
        if (x < 0) {
          this.progress = 0;
        } else if (x > this.width) {
          this.progress = 1;
        } else {
          this.progress = x / this.width;
        }
      }
    );
    this.on(EventManager.ALL_CANCEL, () => {
      this.isTouchStart = false;
      this.emit(Slider.SLIDER_END,this.progress)
    });
    this.on(EventManager.ALL_END, () => {
      this.isTouchStart = false;
      this.emit(Slider.SLIDER_END,this.progress)
    });
  }
  //绘制图片
  draw() {
    super.draw();
    if (!this.sliderSprite) {
      this.sliderSprite = new MultistateSprite();
      this.sliderSprite.anchor.set(0.5, 0.5);
      this.addChild(this.sliderSprite);
    }
    this.sliderSprite.setState();
  }
  //设置图片
  set sliderTexture(texture: Texture) {
    this.sliderSprite.setDefaultState(texture);
    this._sliderTexture = texture;
    this.draw();
    this.sliderSprite.width = texture.width;
    this.sliderSprite.height = texture.height;
  }
  get sliderTexture(): Texture {
    return this._sliderTexture;
  }
  //设置进度的ui
  protected setProgressLayout() {
    this.progressSprite.width = this.width * this.progress;
    this.sliderSprite.x = this.width * this.progress;
  }
  set height(height: number) {
    this.backgroundSprite.height = height;
    this.progressSprite.height = height;
    this.sliderSprite.y = height / 2;
    this.y = this.y;
  }
  get height(): number {
    return this.backgroundSprite.height;
  }
}
