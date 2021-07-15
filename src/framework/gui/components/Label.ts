import { Component } from "../../core/Component";
import { EventPoint } from "../utils/EventPoint"
import { Text, utils } from "pixi.js";
export class Label extends Component {
  private rootText: Text;
  private _text: string = "";
  protected _color: number | string;
  protected _anchor: EventPoint;
  protected _x: number = 0;
  protected _y: number = 0;
  constructor() {
    super();
    this._anchor.on("chageX", () => {
      this.x = this.x;
      this.emit("chageAnchor");
    });
    this._anchor.on("chageY", () => {
      this.y = this.y;
      this.emit("chageAnchor");
    });
  }
  draw() {
    if (!this._anchor) {
      this._anchor = new EventPoint();
    }
    if (!this.rootText) {
      this.rootText = new Text(this._text);
      this.addChild(this.rootText);
    }
  }
  set tint(tint: number) {
    this.color = utils.hex2string(tint);
  }
  get tint(): number {
    return utils.string2hex(this.color);
  }
  /**
   * 设置文本
   */
  set text(text: string) {
    this._text = text;
    this.rootText.text = text;
    this.x = this.x;
    this.y = this.y;
  }
  get text(): string {
    return this._text;
  }
  /**
   * 设置内边距
   */
  set padding(padding: number) {
    this.rootText.style["padding"] = padding;
  }
  get padding(): number {
    return this.rootText.style["padding"];
  }
  /**
   * 设置字体大小
   */
  set fontSize(fontSize: number) {
    this.rootText.style["fontSize"] = fontSize;
  }
  get fontSize(): number {
    return this.rootText.style["fontSize"];
  }
  /**
   * 设置字体
   */
  set font(font: string) {
    this.rootText.style["fontFamily"] = font;
  }
  get font(): string {
    return this.rootText.style["fontFamily"];
  }
  /**
   * 设置颜色
   * “＃00FF00”
   */
  set color(color: number | string) {
    if (typeof color == "string") {
      this.rootText.style["fill"] = color;
    } else {
      this.rootText.style["fill"] = utils.hex2string(color);
    }
  }
  get color(): number | string {
    if (this._color == undefined) {
      return this.rootText.style["fill"];
    }
    return this._color;
  }


  /**
   * 字体描边颜色
   */
  set outlineColor(color: number | string) {
    if (typeof color == "string") {
      this.rootText.style["stroke"] = color;
    } else {
      this.rootText.style["stroke"] = utils.hex2string(color);
    }
  }
  get outlineColor(): number | string {
    return this.rootText.style["stroke"];
  }

  /**
   * 字体描边  宽度
   */
  set outline(outline: number) {
    this.rootText.style["strokeThickness"] = outline;
  }
  get outline(): number {
    return this.rootText.style["strokeThickness"];
  }
  /**
  * The font style ('normal', 'italic' or 'oblique')
  */
  set fontStyle(fontStyle: string) {
    this.rootText.style["fontStyle"] = fontStyle;
  }
  get fontStyle(): string {
    return this.rootText.style["fontStyle"];
  }
  set trim(trim: boolean) {
    this.rootText.style["trim"] = trim;
  }
  get trim(): boolean {
    return this.rootText.style["trim"];
  }
  /**
   * 设置对齐方式
   * left center right
   */
  set align(align: string) {
    this.rootText.style["align"] = align;
  }
  get align(): string {
    return this.rootText.style["align"];
  }
  /**
   * 字体粗细（'正常'，'粗体'，'粗体'，'较轻''normal', 'bold', 'bolder', 'lighter' 和'100'，'200'，'300'，'400'，'500'，'600'，'700'，800'或'900'）
   */
  set fontWeight(fontWeight: string | number) {
    this.rootText.style["fontWeight"] = fontWeight;
  }
  get fontWeight(): string | number {
    return this.rootText.style["fontWeight"];
  }
  /**
   * 行高，一个表示字母使用的垂直空间的数字
   */
  set lineHeight(lineHeight: number) {
    this.rootText.style["lineHeight"] = lineHeight;
  }
  get lineHeight(): number {
    return this.rootText.style["lineHeight"];
  }
  /**
   * 字母之间的间距，默认为0
   */
  set letterSpacing(letterSpacing: number) {
    this.rootText.style["letterSpacing"] = letterSpacing;
  }
  get letterSpacing(): number {
    return this.rootText.style["letterSpacing"];
  }
  /**
   * 是否使用自动换行  /true、false（默认）
   */
  set wordWrap(wordWrap: boolean) {
    this.rootText.style["wordWrap"] = wordWrap;
  }
  get wordWrap(): boolean {
    return this.rootText.style["wordWrap"];
  }
  /**
   * 文本将换行的宽度，需要将wordWrap设置为true
   */
  set wordWrapWidth(wordWrapWidth: number) {
    this.rootText.style["wordWrapWidth"] = wordWrapWidth;
  }
  get wordWrapWidth(): number {
    return this.rootText.style["wordWrapWidth"];
  }
  /**
   * 为文本设置投影  默认false
   */
  set dropShadow(dropShadow: boolean) {
    this.rootText.style["dropShadow"] = dropShadow;
  }
  get dropShadow(): boolean {
    return this.rootText.style["dropShadow"];
  }
  /**
   * 为投影设置alpha 默认1
   */
  set dropShadowAlpha(dropShadowAlpha: number) {
    this.rootText.style["dropShadowAlpha"] = dropShadowAlpha;
  }
  get dropShadowAlpha(): number {
    return this.rootText.style["dropShadowAlpha"];
  }
  /**
   * 为投影设置alpha 默认1
   */
  set dropShadowAngle(dropShadowAngle: number) {
    this.rootText.style["dropShadowAngle"] = dropShadowAngle;
  }
  get dropShadowAngle(): number {
    return this.rootText.style["dropShadowAngle"];
  }
  /**
   * 在阴影上使用的填充样式，例如'red'，'＃00FF00'
   */
  set dropShadowColor(dropShadowColor: string) {
    this.rootText.style["dropShadowColor"] = dropShadowColor;
  }
  get dropShadowColor(): string {
    return this.rootText.style["dropShadowColor"];
  }
  /**
   * 设置投影的距离 默认5
   */
  set dropShadowDistance(dropShadowDistance: number) {
    this.rootText.style["dropShadowDistance"] = dropShadowDistance;
  }
  get dropShadowDistance(): number {
    return this.rootText.style["dropShadowDistance"];
  }
  /**
   * 设置阴影模糊半径 默认0
   */
  set dropShadowBlur(dropShadowBlur: number) {
    this.rootText.style["dropShadowBlur"] = dropShadowBlur;
  }
  get dropShadowBlur(): number {
    return this.rootText.style["dropShadowBlur"];
  }


  set x(x: number) {
    this.rootText.x = x - this.anchor.x * this.width;
    this._x = x;
  }
  get x(): number {
    return this._x;
  }
  set y(y: number) {
    this.rootText.y = y - this.anchor.y * this.height;
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
