import { MultistateComponent } from "./MultistateComponent";
import { Label } from "./Label";
import { EventManager } from "../../event/EventManager";
import { EventPoint } from "../utils/EventPoint"
import { Point, Texture } from "pixi.js";
/**
 * 按钮
 */
export class Button extends MultistateComponent {
  protected _pressedTexture!: Texture;
  _Label!: Label;
  public static STATE = {
    NORMAL: "normal",
    PRESSED: "pressed",
    DISABLED: "disabled"
  };
  protected _anchor!: EventPoint;
  protected _x: number = 0;
  protected _y: number = 0;
  private _labelPosition!: EventPoint;
  private _labelPressedColor!: string | number;
  private _labelColor!: string | number;
  private _labelDisabledColor!: string | number;
  constructor(options?: {
    normalTexture?: Texture;
    pressedTexture?: Texture;
    disabledTexture?: Texture;
    width?: number;
    height?: number;
  }) {
    super(options);
    this.buttonMode = true;
    // this.interactive = true;
    if (options) {
      if (options.pressedTexture) {
        this.pressedTexture = options.pressedTexture;
      }
    }
    this._anchor.on("chageX", () => {
      this.x = this.x;
      this.emit("chageAnchor");
    });
    this._anchor.on("chageY", () => {
      this.y = this.y;
      this.emit("chageAnchor");
    });
    this._labelPosition.on("chageX", () => {
      this.relayout();
    });
    this._labelPosition.on("chageY", () => {
      this.relayout();
    });
  }
  draw() {
    if (!this._anchor) {
      this._anchor = new EventPoint();
    }
    if (!this._labelPosition) {
      this._labelPosition = new EventPoint();
    }
    super.draw();
    if (!this._Label) {
      this._Label = new Label();
      this._Label.zIndex = 2;
      // this.label = "heheheh";
      this.rootComponent.addChild(this._Label);
    }
    if(this.currState == Button.STATE.NORMAL&& this.labelColor!=undefined){
      this._Label.color = this.labelColor;
    }
    if(this.currState == Button.STATE.PRESSED&& this.labelPressedColor!=undefined){
      this._Label.color = this.labelPressedColor;
    }
    if(this.currState == Button.STATE.DISABLED && this.labelDisabledColor!=undefined){
      this._Label.color = this.labelDisabledColor;
    }
  }
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(disabled: boolean) {
    this._disabled = disabled;
    this.buttonMode = !disabled;
    this.interactive = !disabled;
    this.draw();
  }


  relayout() {
    this._Label.x = (this.width - this._Label.width) / 2+this.labelPosition.x;
    this._Label.y = (this.height - this._Label.height) / 2+this.labelPosition.y;
  }
  set label(label: string) {
    this._Label.text = label;
    this.relayout();
  }
  get label(): string {
    return this._Label.text;
  }
  set labelSize(size: number) {
    this._Label.fontSize = size;
    this.relayout();
  }
  get labelSize(): number {
    return this._Label.fontSize;
  }
  set labelFont(font: string) {
    this._Label.font = font;
    this.relayout();
  }
  get labelFont(): string {
    return this._Label.font;
  }

  set labelColor(color: number | string) {
    this._labelColor = color;
    this.draw();
  }
  get labelColor(): number | string {
    return this._labelColor;
  }
  set labelPressedColor(color: number | string) {
    this._labelPressedColor = color;
    this.draw();
  }
  get labelPressedColor(): number | string {
    return this._labelPressedColor;
  }
  set labelDisabledColor(color: number | string) {
    this._labelDisabledColor = color;
    this.draw();
  }
  get labelDisabledColor(): number | string {
    return this._labelDisabledColor;
  }

  set labelPosition(pos: Point) {
    this._labelPosition = <any>pos;
    this.relayout();
  }
  get labelPosition():Point {
    return this._labelPosition;
  }
  set labelX(x: number) {
    this._labelPosition.x = x;
  }
  get labelX():number {
    return this._labelPosition.x;
  }
  set labelY(y: number) {
    this._labelPosition.y = y;
  }
  get labelY():number {
    return this._labelPosition.y;
  }

  set tint(tint: number) {
    this.rootSprite.tint = tint;
  }
  get tint(): number {
    return this.rootSprite.tint;
  }
  set width(width: number) {
    this.rootSprite.width = width;
    this.relayout();
    this.emit("chageSize");
  }
  get width(): number {
    return this.rootSprite.width;
  }
  set height(height: number) {
    this.rootSprite.height = height;
    this.relayout();
    this.emit("chageSize");
  }
  get height(): number {
    return this.rootSprite.height;
  }

  /**
   * 设置事件
   */
  handleEvents() {
    this.on(EventManager.ALL_START, () => {
      this.currState = Button.STATE.PRESSED;
      this.draw();
    });
    this.on(EventManager.ALL_CANCEL, () => {
      this.currState = Button.STATE.NORMAL;
      this.draw();
    });
    this.on(EventManager.ALL_END, () => {
      this.currState = Button.STATE.NORMAL;
      this.draw();
    });
  }
  /**
   * 按下的状态
   */
  set pressedTexture(texture: Texture) {
    this.rootSprite.addState(Button.STATE.PRESSED, texture);
    this._pressedTexture = texture;
    this.draw();
    this.x = this.x;
    this.y = this.y;
  }
  get pressedTexture(): Texture {
    return this._pressedTexture;
  }
  set x(x: number) {
    this.rootComponent.x = x - this.anchor.x * this.width;
    this._x = x;
    this.draw();
  }
  get x(): number {
    return this._x;
  }
  set y(y: number) {
    this.rootComponent.y = y - this.anchor.y * this.height;
    this._y = y;
    this.draw();
  }
  get y(): number {
    return this._y;
  }

  set anchor(anchor: Point) {
    this._anchor = <EventPoint>anchor;
    this.x = this.x;
    this.y = this.y;
  }
  get anchor(): Point {
    return this._anchor;
  }
}
