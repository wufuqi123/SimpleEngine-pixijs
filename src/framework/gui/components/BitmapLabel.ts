import { Component } from "../../core/Component";
import { BitmapFontData } from "../../font/BitmapFontData";
import { Label } from "./Label";
import { Image } from "./Image";
import { ObjectPool } from "../../core/ObjectPool";
import {EventPoint} from "../utils/EventPoint"
import { utils } from "pixi.js";
export class BitmapLabel extends Component {
  rootComponent: Component;
  mBitmapFontData: BitmapFontData;
  textObjectPool: ObjectPool<Label> = new ObjectPool();
  imageObjectPool: ObjectPool<Image> = new ObjectPool();
  private _text: string;
  private __width: number;
  private __height: number;
  private _letterSpacing: number = 0;
  private _fontSize: number;
  private _font: string;
  private _color: string | number;
  private _wordWrap: boolean;
  private _wordWrapWidth: number;
  private _lineHeight: number;
  private _horizontalAlign: string = "left";
  private _verticalAlign: string = "bottom";
  private rowWidthArr: Array<number> = new Array();
  protected _x:number = 0;
  protected _y:number = 0;
  protected _anchor: EventPoint;
  constructor(bitmapFontData: BitmapFontData) {
    super();
    this.mBitmapFontData = bitmapFontData;
    this.font = bitmapFontData.info.face;
    this._anchor.on("chageX",()=>{
      this.x = this.x;
      this.emit("chageAnchor");
    });
    this._anchor.on("chageY",()=>{
      this.y = this.y;
      this.emit("chageAnchor");
    });
  }
  draw() {
    if(!this._anchor){
      this._anchor = new EventPoint();
    }
    if (!this.rootComponent) {
      this.rootComponent = new Component();
      this.addChild(this.rootComponent);
    }
    this.clearView();
    this.width = 0;
    this.height = 0;
    if (!this.text || this.text == "") {
      return;
    }
    let textArr = this.text.split("");
    textArr.forEach((chat) => {
      let view = this.createText(chat);
      this.rootComponent.addChild(view);
    });
    this.layout();
  }
  layout() {
    let width = 0;
    let height = 0;
    let maxWidth = 0;
    let maxHeight = 0;
    this.rowWidthArr.length = 0;
    let row = 0;
    let column = 0;
    this.rootComponent.children.forEach((v: Label | Image, i: number) => {
      if (
        this.wordWrap &&
        this.wordWrapWidth < width + v.width + this.letterSpacing
      ) {
        maxHeight =0;
        column = 0;
        this.rowWidthArr[row] = width;
        row++;

        width = 0;
        height += this.lineHeight || maxHeight;
      }
      column++;
      v.x = width;
      v.y = height;
      width += v.width + this.letterSpacing;
      if (i == this.rootComponent.children.length - 1) {
        width -= this.letterSpacing;
      }
      if (maxHeight < v.height) {
        maxHeight = v.height;
      }
      if (maxWidth < width) {
        maxWidth = width;
      }
      v.row = row;
      v.column = column;
    });
    this.rowWidthArr[row] = width;
    this.width = maxWidth;
    this.height = height + maxHeight;
    this.alignLayout();
  }
  private alignLayout() {
    this.rootComponent.children.forEach((v) => {
      let currWidth = this.rowWidthArr[v.row];
      let offsetX = 0;
      let offsetY = this.height - v.height;
      switch (this.verticalAlign) {
        case "top":
          offsetY = 0;
          break;
        case "center":
          offsetY = (this.height - v.height) / 2;
          break;
        case "bottom":
          offsetY = this.height - v.height;
          break;
      }
      switch (this.horizontalAlign) {
        case "left":
          offsetX = 0;
          break;
        case "center":
          offsetX = (this.width - currWidth) / 2;
          break;
        case "right":
          offsetX = this.width - currWidth;
          break;
      }
      v.x += offsetX;
      v.y += offsetY;
    });
  }

  private createText(chat: string): Label | Image {
    let chatId = parseInt(chat.charCodeAt(0).toString(10));
    let chatBitmap = this.mBitmapFontData.charMap.get(chatId);
    if (chatBitmap) {
      let image = this.imageObjectPool.get();
      if (!image) {
        image = new Image();
      }
      if (!isNaN(this.fontSize) && this.fontSize != undefined) {
        let rate = image.width / image.height;
        image.width = this.fontSize;
        image.height = image.width * rate;
      }
      if (this.color) {
        image.color = this.color;
      }
      image.texture = chatBitmap.texture;
      return image;
    }
    let text = this.textObjectPool.get();
    if (!text) {
      text = new Label();
      if (!isNaN(this.fontSize)) {
        text.fontSize = this.fontSize;
      }
      text.font = this.font;
      if (this.color) {
        text.color = this.color;
      }
      text.lineHeight = text.lineHeight;
    }
    text.text = chat;
    return text;
  }

  private clearView() {
    this.rootComponent.children.forEach((v: Label | Image) => {
      v.removeFromParent();
      if (v instanceof Label) {
        this.textObjectPool.put(v);
      } else if (v instanceof Image) {
        this.imageObjectPool.put(v);
      }
    });
    this.rootComponent.children.length = 0;
  }

  set text(text: string) {
    this._text = text;
    this.draw();
  }
  get text(): string {
    return this._text;
  }



  /**
   * 字母之间的间距，默认为0
   */
  set letterSpacing(letterSpacing: number) {
    this._letterSpacing = letterSpacing;
    this.layout();
  }
  get letterSpacing(): number {
    return this._letterSpacing;
  }

  /**
   * 设置字体大小
   */
  set fontSize(fontSize: number) {
    this._fontSize = fontSize;
    this.draw();
  }
  get fontSize(): number {
    return this._fontSize;
  }
  /**
   * 设置字体
   */
  set font(font: string) {
    this._font = font;
    this.draw();
  }
  get font(): string {
    return this._font;
  }
  /**
   * 设置颜色
   * “＃00FF00”
   */
  set color(color: number | string) {
    if (isNaN(color)) {
      this._color = color;
    } else {
      this._color = utils.hex2string(color);
    }
    this.draw();
  }
  get color(): number | string {
    return this._color;
  }

  /**
   * 是否使用自动换行  /true、false（默认）
   */
  set wordWrap(wordWrap: boolean) {
    this._wordWrap = wordWrap;
    this.layout();
  }
  get wordWrap(): boolean {
    return this._wordWrap;
  }
  /**
   * 文本将换行的宽度，需要将wordWrap设置为true
   */
  set wordWrapWidth(wordWrapWidth: number) {
    this._wordWrapWidth = wordWrapWidth;
    this.layout();
  }
  get wordWrapWidth(): number {
    return this._wordWrapWidth;
  }

  /**
   * 行高，一个表示字母使用的垂直空间的数字
   */
  set lineHeight(lineHeight: number) {
    this._lineHeight = lineHeight;
    this.layout();
  }
  get lineHeight(): number {
    return this._lineHeight;
  }

  /**
   * 设置水平对齐方式
   * left center right
   */
  set horizontalAlign(horizontalAlign: string) {
    this._horizontalAlign = horizontalAlign;
    this.alignLayout();
  }
  get horizontalAlign(): string {
    return this._horizontalAlign;
  }
  /**
   * 设置垂直对齐方式
   * top  center  bottom
   */
  set verticalAlign(verticalAlign: string) {
    this._verticalAlign = verticalAlign;
    this.alignLayout();
  }
  get verticalAlign(): string {
    return this._verticalAlign;
  }
  /**
   * 设置对齐方式
   * @param horizontalAlign 水平对齐方式
   * @param verticalAlign 垂直对齐方式
   */
  align(horizontalAlign?: string, verticalAlign?: string) {
    if (horizontalAlign) {
      this.horizontalAlign = horizontalAlign;
    }
    if (verticalAlign) {
      this.verticalAlign = verticalAlign;
    }
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
  set width(width: number) {
    this.__width = width;
    this.x = this.x;
  }
  get width(): number {
    return this.__width;
  }
  set height(height: number) {
    this.__height = height;
    this.y = this.y;
  }
  get height(): number {
    return this.__height;
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
