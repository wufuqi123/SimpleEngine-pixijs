import { Component } from "../../core/Component";
import { RichTextParse } from "../utils/RichTextParse";
import { ResManager } from "../../core/ResManager";
import { EventPoint } from "../utils/EventPoint";
import { ObjectPool } from "../../core/ObjectPool";
import { Label } from "./Label";
import { Image } from "./Image";
// import { Log } from "../../log/Log";
export class RichText extends Component {
  protected rootComponent: Component;
  private _text: string = "";
  private _font: string = "Arial";
  private _horizontalAlign: string = "left";
  private _verticalAlign: string = "bottom";
  private _fontSize: number = 26;
  protected _color: number | string = "black";
  private _fontWeight: number | string = "normal";
  private _lineHeight: number = NaN;
  private _letterSpacing: number = 0;
  private _dropShadowAlpha: number = 1;
  private _dropShadowAngle: number = Math.PI / 6;
  private _dropShadow: boolean = false;
  private _dropShadowColor: string = "black";
  private _dropShadowDistance: number = 5;
  private _dropShadowBlur: number = 0;
  private _wordWrap: boolean = false;
  private _wordWrapWidth: number = 100;
  private _anchor: EventPoint;
  private _width: number = 0;
  private _height: number = 0;
  private _fontStyle: string = "normal";
  protected mLabelObjectPool: ObjectPool<Label> = new ObjectPool();
  protected mImageObjectPool: ObjectPool<Image> = new ObjectPool();
  protected mViewArr: Array<Array<Label | Image>>;
  mDataArr: Map<string, string>[];

  constructor() {
    super();
    this._anchor.on("chageX", () => {
      this.anchor = this.anchor;
    });
    this._anchor.on("chageY", () => {
      this.anchor = this.anchor;
    });
  }

  draw() {
    if (!this.rootComponent) {
      this.rootComponent = new Component();
      this.addChild(this.rootComponent);
    }
    if (!this._anchor) {
      this._anchor = new EventPoint();
    }
    if (!Array.isArray(this.mViewArr)) {
      this.mViewArr = new Array();
    }
    this.clearView();
    if (
      this.text == undefined ||
      this.text == null ||
      typeof this.text != "string" ||
      this.text == ""
    ) {
      this.width = 0;
      this.height = 0;
      return;
    }
    this.parseLabel();
    this.layout();
  }

  /**
   * 解析文字
   */
  parseLabel() {
    let richTextParse = new RichTextParse(this.text);
    richTextParse.on("end", this.parse.bind(this));
    richTextParse.parse();
  }
  /**
   * 测量文本
   * @param text
   * @param obj
   */
  measureText(text: string, obj?: any): { width: number; height: number } {
    let ret = {
      width: 0,
      height: 0,
    };
    let label = this.mLabelObjectPool.get();
    if (!label) {
      label = new Label();
    }
    label.x = 0;
    label.y = 0;
    label.text = text;
    label.font = obj.font || this.font;
    label.fontSize = obj.fontSize || this.fontSize;
    label.lineHeight = obj.fontSize || this.lineHeight;
    label.fontWeight = obj.fontWeight || this.fontWeight;
    label.fontStyle = obj.fontStyle || this.fontStyle;
    label.letterSpacing = obj.letterSpacing || this.letterSpacing;
    label.dropShadow = obj.dropShadow || this.dropShadow;
    label.dropShadowAlpha = obj.dropShadowAlpha || this.dropShadowAlpha;
    label.dropShadowAngle = obj.dropShadowAngle || this.dropShadowAngle;
    label.dropShadowColor = obj.dropShadowColor || this.dropShadowColor;
    label.dropShadowBlur = obj.dropShadowBlur || this.dropShadowBlur;
    label.dropShadowDistance =
      obj.dropShadowDistance || this.dropShadowDistance;
    label.color = obj.color || this.color;
    ret.width = label.width;
    ret.height = label.height;
    this.mLabelObjectPool.put(label);
    return ret;
  }
  /**
   * 获取 label
   * @param text
   * @param obj
   */
  getTextView(text: string, obj?: any): Label {
    let label = this.mLabelObjectPool.get();
    if (!label) {
      label = new Label();
    }
    label.text = text;
    label.font = obj.font || this.font;
    label.fontSize = obj.fontSize || this.fontSize;
    label.lineHeight = obj.lineHeight || this.lineHeight;
    label.fontWeight = obj.fontWeight || this.fontWeight;
    label.fontStyle = obj.fontStyle || this.fontStyle;
    label.dropShadow = obj.dropShadow || this.dropShadow;
    label.dropShadowAlpha = obj.dropShadowAlpha || this.dropShadowAlpha;
    label.dropShadowAngle = obj.dropShadowAngle || this.dropShadowAngle;
    label.dropShadowColor = obj.dropShadowColor || this.dropShadowColor;
    label.dropShadowBlur = obj.dropShadowBlur || this.dropShadowBlur;
    label.dropShadowDistance =
      obj.dropShadowDistance || this.dropShadowDistance;
    label.letterSpacing = obj.fontStyle || this.letterSpacing;
    label.color = obj.color || this.color;
    this.rootComponent.addChild(label);
    return label;
  }

  parse(arr: Array<Map<string, string>>) {
    if (arr) {
      this.mDataArr = arr;
    } else {
      arr = this.mDataArr;
    }
    // Log.info("文字", arr);
    let row = 0;
    let currWidth = 0;
    arr.forEach((textObj) => {
      let icon = textObj.get("icon");
      let text = textObj.get("text");
      let font = textObj.get("font");
      let fontSize = textObj.get("size");
      let fontStyle = textObj.get("fontStyle");
      let color = textObj.get("color");
      let style = { font, fontSize: parseInt(fontSize), fontStyle, color };
      let measureInfo;
      if (text) {
        let textArr = text.split("");
        let str = "";
        for (let i = 0; i < textArr.length; i++) {
          str += textArr[i];
          //测量文本
          measureInfo = this.measureText(str, style);
          let isNewLine = textArr[i] == "\r" || textArr[i] == "\n";
          if (isNewLine) {
            let lineStr = text.substring(i, i + 2);
            if (lineStr == "\n\r") {
              str = str.substring(0, str.length - 1);
              continue;
            }
          }

          //是否换行
          if (this.wordWrap || isNewLine) {
            // Log.info(
            //   "文字  --",
            //   this.wordWrapWidth,
            //   measureInfo.width + currWidth
            // );
            //当当前宽度大于  最大换行宽度
            if (
              this.wordWrapWidth <= measureInfo.width + currWidth ||
              isNewLine
            ) {
              let rowView = this.mViewArr[row];
              if (!Array.isArray(rowView)) {
                rowView = new Array();
                this.mViewArr[row] = rowView;
              }
              //当str只有一个子的时候  强制使用当前行
              //否则换行
              // if(rowView.length !=0 && str.length != 1){
              //   i--;
              //   str = str.substring(0,str.length-1);
              // }
              if (isNewLine) {
                i++;
              }
              i--;

              str = str.substring(0, str.length - 1);

              let view = this.getTextView(str, style);
              // Log.info("文字 当前宽度", measureInfo);
              rowView.push(view);
              currWidth = 0;
              row++;
              str = "";
            }
          }
        }
        if (str != "") {
          let rowView = this.mViewArr[row];
          if (!Array.isArray(rowView)) {
            rowView = new Array();
            this.mViewArr[row] = rowView;
          }
          let view = this.getTextView(str, style);
          currWidth += view.width + this.letterSpacing;
          rowView.push(view);
        }
      }
    });

    // Log.info("文字 view", this.mViewArr);
  }

  layout() {
    // Log.info("文字 布局", this.mViewArr);
    let heightArr: Array<number> = [];
    let widthArr: Array<number> = [];
    this.mViewArr.forEach((v, i) => {
      let height = 0;
      let width = 0;
      v.forEach((view: Label | Image,j) => {
        if (view.height > height) {
          height = view.height;
        }
        let letterSpacing = this.letterSpacing;
        if(j==0){
          letterSpacing = 0;
        }
        width += view.width+letterSpacing;
      });
      heightArr[i] = height;
      widthArr[i] = width;
    });

    let maxWidth = 0;
    
    widthArr.forEach((w) => {
      if(w>maxWidth){
        maxWidth = w;
      }
    });

    this.mViewArr.forEach((v, row) => {
      let width = 0;
      let height = heightArr[row - 1];
      if (isNaN(height)) {
        height = 0;
      }
      let offX = 0;
      if(this.horizontalAlign == "left"){
        offX = 0;
      }else if (this.horizontalAlign == "center") {
        offX = (maxWidth - widthArr[row] ) / 2;
      } else if (this.horizontalAlign == "right") {
        offX = maxWidth - widthArr[row];
      }

      v.forEach((view: Label | Image, i) => {
        let offY = 0;
        if (this.verticalAlign == "top") {
          offY = 0;
        } else if (this.verticalAlign == "center") {
          offY = (heightArr[row] - view.height) / 2;
        } else if (this.verticalAlign == "bottom") {
          offY = heightArr[row] - view.height;
        }
  

        view.x = width + offX;
        view.y = height + offY;
        width += view.width + this.letterSpacing;
      });

    });
    let maxHeight = 0;

    heightArr.forEach((h) => {
      maxHeight += h;
    });
    this.width = maxWidth;
    this.height = maxHeight;
    // Log.info("文字 布局", this.width, this.height);
  }

  clearView() {
    this.mViewArr.forEach((v) => {
      v.forEach((lable: Label | Image) => {
        if (lable instanceof Label) {
          this.mLabelObjectPool.put(lable);
        } else if (lable instanceof Image) {
          this.mImageObjectPool.put(lable);
        }
        lable.removeFromParent();
      });
      v.length = 0;
    });
    this.mViewArr.length = 0;
  }

  set height(height: number) {
    this._height = height;
    this.anchor = this.anchor;
  }
  get height(): number {
    return this._height;
  }
  set width(width: number) {
    this._width = width;
    this.anchor = this.anchor;
  }
  get width(): number {
    return this._width;
  }

  set anchor(anchor: Point) {
    this._anchor = anchor;
    this.rootComponent.x = -this.width * this.anchor.x;
    this.rootComponent.y = -this.height * this.anchor.y;
  }
  get anchor(): Point {
    return this._anchor;
  }

  /**
   * 设置文本
   */
  set text(text: string) {
    this._text = text;
    this.draw();
  }
  get text(): string {
    return this._text;
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
    this._color = color;
    this.draw();
  }
  get color(): number | string {
    return this._color;
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
  /**
   * 设置水平对齐方式
   * left center right
   */
  set horizontalAlign(horizontalAlign: string) {
    this._horizontalAlign = horizontalAlign;
    this.layout();
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
    this.layout();
  }
  get verticalAlign(): string {
    return this._verticalAlign;
  }

  /**
   * 字体粗细（'正常'，'粗体'，'粗体'，'较轻''normal', 'bold', 'bolder', 'lighter' 和'100'，'200'，'300'，'400'，'500'，'600'，'700'，800'或'900'）
   */
  set fontWeight(fontWeight: string | number) {
    this._fontWeight = fontWeight;
    this.draw();
  }
  get fontWeight(): string | number {
    return this._fontWeight;
  }
  /**
   * The font style ('normal', 'italic' or 'oblique')
   */
  set fontStyle(fontStyle: string) {
    this._fontStyle = fontStyle;
    this.draw();
  }
  get fontStyle(): string {
    return this._fontStyle;
  }
  /**
   * 行高，一个表示字母使用的垂直空间的数字
   */
  set lineHeight(lineHeight: number) {
    this._lineHeight = lineHeight;
    this.draw();
  }
  get lineHeight(): number {
    return this._lineHeight;
  }
  /**
   * 字母之间的间距，默认为0
   */
  set letterSpacing(letterSpacing: number) {
    this._letterSpacing = letterSpacing;
    // this.draw();
    this.layout();
  }
  get letterSpacing(): number {
    return this._letterSpacing;
  }
  /**
   * 为文本设置投影  默认false
   */
  set dropShadow(dropShadow: boolean) {
    this._dropShadow = dropShadow;
    this.draw();
  }
  get dropShadow(): boolean {
    return this._dropShadow;
  }
  /**
   * 为投影设置alpha 默认1
   */
  set dropShadowAlpha(dropShadowAlpha: number) {
    this._dropShadowAlpha = dropShadowAlpha;
    this.draw();
  }
  get dropShadowAlpha(): number {
    return this._dropShadowAlpha;
  }
  /**
   * 为投影设置alpha 默认1
   */
  set dropShadowAngle(dropShadowAngle: number) {
    this._dropShadowAngle = dropShadowAngle;
    this.draw();
  }
  get dropShadowAngle(): number {
    return this._dropShadowAngle;
  }
  /**
   * 在阴影上使用的填充样式，例如'red'，'＃00FF00'
   */
  set dropShadowColor(dropShadowColor: string) {
    this._dropShadowColor = dropShadowColor;
    this.draw();
  }
  get dropShadowColor(): string {
    return this._dropShadowColor;
  }
  /**
   * 设置投影的距离 默认5
   */
  set dropShadowDistance(dropShadowDistance: number) {
    this._dropShadowDistance = dropShadowDistance;
    this.draw();
  }
  get dropShadowDistance(): number {
    return this._dropShadowDistance;
  }
  /**
   * 设置阴影模糊半径 默认0
   */
  set dropShadowBlur(dropShadowBlur: number) {
    this._dropShadowBlur = dropShadowBlur;
    this.draw();
  }
  get dropShadowBlur(): number {
    return this._dropShadowBlur;
  }
  /**
   * 是否自动换行
   */
  set wordWrap(wordWrap: boolean) {
    this._wordWrap = wordWrap;
    this.draw();
  }
  get wordWrap(): boolean {
    return this._wordWrap;
  }
  /**
   * 自动换行的  宽度
   */
  set wordWrapWidth(wordWrapWidth: number) {
    this._wordWrapWidth = wordWrapWidth;
    this.draw();
  }
  get wordWrapWidth(): number {
    return this._wordWrapWidth;
  }
}
