import { Switch } from "./Switch";
import { RichText } from "./RichText";
import { Log } from "../../log/Log";

/**
 * 带文本的  开关
 */
export class SwitchText extends Switch {
  protected leftTextView: RichText;
  protected rightTextView: RichText;
  private _rightTextX: number;
  /**
   * 绘制图片
   */
  draw() {
    super.draw();
    if (!this.leftTextView) {
      this.leftTextView = new RichText();
      this.addChild(this.leftTextView);
      this.leftTextX = 0;
      this.leftTextY = 0;
    }
    if (!this.rightTextView) {
      this.rightTextView = new RichText();
      this.addChild(this.rightTextView);
      this.rightTextView.anchor.x = 1;
      this.rightTextX = 0;
      this.rightTextY = 0;
    }
    this.chageView();
  }

    /**
   * 更改渲染
   */
  chageView(){
    super.chageView();
    this.leftTextView.opacity = this.selected?255:0;
    this.rightTextView.opacity = !this.selected?255:0;
  }
  /**
   * 设置左边文字
   */
  set leftText(text: string) {
    this.leftTextView.text = text;
  }
  get leftText(): string {
    return this.leftTextView.text;
  }
  /**
   * 设置左边字体样式
   */
  set leftTextFont(font: string) {
    this.leftTextView.font = font;
  }
  get leftTextFont(): string {
    return this.leftTextView.font;
  }

  /**
   * 设置左边文字大小
   */
  set leftTextSize(size: number) {
    this.leftTextView.fontSize = size;
  }
  get leftTextSize(): number {
    return this.leftTextView.fontSize;
  }
  /**
   * 设置左边文字颜色
   */
  set leftTextColor(color: number | string) {
    this.leftTextView.color = color;
  }
  get leftTextColor(): number | string {
    return this.leftTextView.color;
  }
  /**
   * 左边 文字  x
   */
  set leftTextX(x: number) {
    this.leftTextView.x = x;
  }
  get leftTextX(): number{
    return this.leftTextView.x;
  }
  /**
   * 左边 文字  y
   */
  set leftTextY(y: number) {
    this.leftTextView.y = y;
  }
  get leftTextY(): number{
    return this.leftTextView.y;
  }

  /**
   * 设置右边文字
   */
  set rightText(text: string) {
    this.rightTextView.text = text;
  }
  get rightText(): string {
    return this.rightTextView.text;
  }
  /**
   * 设置右边字体样式
   */
  set rightTextFont(font: string) {
    this.rightTextView.font = font;
  }
  get rightTextFont(): string {
    return this.rightTextView.font;
  }

  /**
   * 设置右边文字大小
   */
  set rightTextSize(size: number) {
    this.rightTextView.fontSize = size;
  }
  get rightTextSize(): number {
    return this.rightTextView.fontSize;
  }

  /**
   * 设置右边文字颜色
   */
  set rightTextColor(color: number | string) {
    this.rightTextView.color = color;
  }
  get rightTextColor(): number | string {
    return this.rightTextView.color;
  }
  set width(width: number) {
    this.backgroundSprite.width = width;
    this.sliderX = this.sliderX;
    this.x = this.x;
    this.rightTextX =this.rightTextX
  }
  get width(): number {
    return this.backgroundSprite.width;
  }
  /**
   * 右边 文字  x
   */
  set rightTextX(x: number) {
    this._rightTextX = x;
    this.rightTextView.x = x + this.width;
  }
  get rightTextX(): number{
    return this._rightTextX;
  }
  /**
   * 右边 文字  y
   */
  set rightTextY(y: number) {
    this.rightTextView.y = y;
  }
  get rightTextY(): number{
    return this.rightTextView.y;
  }

}
