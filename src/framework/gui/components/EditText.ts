import { Component } from "../../core/Component";
import { Image } from "./Image";

import { utils, Point } from "pixi.js";
import { GameTexture } from "../GameTexture";
import { EventManager } from "../../event/EventManager";
import { GameApplication, EventPoint,Log } from "../../../framework";
import { AVGBuilder } from "../../../avggame";
import { RichText } from "./RichText";

//保证  界面EditText获得焦点时不上滑
(/iphone|ipod|ipad/i.test(navigator.appVersion)) && document.addEventListener(
  'blur',
  event => {
    // 当页面没出现滚动条时才执行，因为有滚动条时，不会出现这问题
          // input textarea 标签才执行，因为 a 等标签也会触发 blur 事件
      if (
          document.documentElement.offsetHeight <=
          document.documentElement.clientHeight &&
          ['input', 'textarea'].includes((<any>event).target.localName)
      ) {
          document.body.scrollIntoView() // 回顶部
      }
  },
  true
)

export class EditText extends Component {
  private bg!: Image;
  private rootComponent!: Component;
  private _width!: number;
  private _height!: number;
  isFocus: boolean = false;
  private _windowClick!: (event: any) => void;
  private inputRootContainer!: HTMLDivElement;
  private inputContainer!: HTMLInputElement;

  private _fontSize: number = 15;
  private label!: RichText;
  private _x: number = 0;
  private _y: number = 0;
  protected _anchor!: EventPoint;
  constructor(){
    super();
    this._anchor.on("chageX",()=>{
      this.x = this.x;
      this.emit("chageAnchor");
    });
    this._anchor.on("chageY",()=>{
      this.y = this.y;
      this.emit("chageAnchor");
    });
    this.updateInputSize();
  }
  draw() {
    if(!this._anchor){
      this._anchor = new EventPoint();
    }
    this.initInputRootContainer();
    this.initInputContainer();
    if (!this.rootComponent) {
      this.rootComponent = new Component();
      this.addChild(this.rootComponent);
    }
    if (!this.bg) {
      this.bg = new Image();
      this.bg.texture = GameTexture.WHITE;
      this.rootComponent.addChild(this.bg);
      this.width = 0;
      this.height = 0;
      this._windowClick = this.windowClick.bind(this);
      // window.addEventListener("click", this._windowClick);
      window.addEventListener("touchend", this._windowClick);
      this.bg.on(EventManager.ALL_CLICK, this.cilck.bind(this));
    }

    if(!this.label){
      this.label = new RichText();
      this.label.anchor.y = 0.5;
      this.rootComponent.addChild(this.label);
      this.fontSize = 15;
      this.fontStyle = this.fontStyle;
      this.font = this.font;
      this.label.active = false;
    }
  }
  /**
   * 初始化   input的外层div
   */
  private initInputRootContainer() {
    if (this.inputRootContainer) return;
    let inputRootContainer = document.getElementById("inputRootContainer");
    if (inputRootContainer) {
      this.inputRootContainer = <any>inputRootContainer;
      return;
    }
    this.inputRootContainer = document.createElement("div");
    this.inputRootContainer.id = "inputRootContainer";
    this.inputRootContainer.style.position = "absolute";
    this.inputRootContainer.style.width = "0";
    this.inputRootContainer.style.height = "0";
    
    
    document.body.appendChild(this.inputRootContainer);
  }
  /**
   * 初始化当前  input
   */
  private initInputContainer() {
    if (this.inputContainer) return;
    this.inputContainer = document.createElement("input");
    this.inputContainer.type = "text";
    this.inputContainer.onblur = this.blur.bind(this);
    this.inputContainer.onfocus = this.focus.bind(this);
    this.inputContainer.onchange = ()=>{document.body.scrollTop = 0;this.emit("change")}
    this.inputContainer.onkeydown = ()=>{document.body.scrollTop = 0;this.emit("keydown")}
    this.inputContainer.onkeypress = ()=>{document.body.scrollTop = 0;this.emit("keypress")}
    this.inputContainer.onkeyup = ()=>{document.body.scrollTop = 0;this.emit("keyup")}
    this.inputRootContainer.appendChild(this.inputContainer);
  }

  /**
   * 设置字体大小
   */
  set fontSize(fontSize: number) {
    this._fontSize = fontSize;
    if(this.label){
      this.label.fontSize = fontSize;
    }
    this.inputContainer.style.fontSize = fontSize*this.worldTransform.a+"px";
  }
  get fontSize(): number {
    return this._fontSize;
  }

   /**
   * 设置颜色
   * “＃00FF00”
   */
  set color(color: number|string) {
    this._color = color;
    if(typeof color == "string"){
      this.inputContainer.style.color = color;
    }else{
      this.inputContainer.style.color = utils.hex2string(color);
    }
    this.label.color = color;
  }
  get color(): number|string {
    if(this._color == undefined){
      return this.label.color;
    }
    return this._color;
  }

  /**
   * 设置背景颜色
   */
  set backgroundColor(backgroundColor: number|string){
    this.bg.color = backgroundColor;
  }
  get backgroundColor(): number|string{
    return this.bg.color;
  }
  /**
   * 设置背景透明度
   */
  set backgroundOpacity(backgroundOpacity:number){
    this.bg.opacity =backgroundOpacity;
  }
  get backgroundOpacity():number{
      return this.bg.opacity;
  }
  /**
   * 提示
   */
  set placeholder(placeholder: string){
    this.inputContainer.placeholder = placeholder;
  }
  get placeholder(): string{
    return this.inputContainer.placeholder;
  }
  /**
   * 设置文字最大长度
   */
  set maxlength(maxlength: number){
    this.inputContainer.setAttribute("maxlength",""+maxlength)
  }
  get maxlength(): number{
    let maxlength =this.inputContainer.getAttribute("maxlength")
    if(!maxlength|| isNaN(parseInt(maxlength))){
      return Math.LOG10E;
    }
    return parseInt(maxlength);
  }
  /**
   * 设置文本
   */
  set text(text: string){
    this.inputContainer.value = text;
    this.label.text = text;
  }
  get text(): string{
    return this.inputContainer.value;
  }
  /**
   * 设置字体
   */
  set font(font: string) {
    this.inputContainer.style.fontFamily = font;
    this.label.font = font;
  }
  get font(): string {
    return this.label.font;
  }

  /**
   *设置字体样式   加粗等 ('normal', 'italic' or 'oblique')
   */
  set fontStyle(fontStyle: string ) {
    this.inputContainer.style.fontStyle = fontStyle;
    this.label.fontStyle = fontStyle;
  }
  get fontStyle(): string {
    return this.label.fontStyle;
  }

  /**
   * 获取焦点
   */
  focus() {
    document.body.scrollTop = 0;
    if (this.isFocus) return;
    this.isFocus = true;
    this.emit("focus");
    this.inputContainer.focus();
  }
  /**
   * 失去焦点
   */
  blur() {
    document.body.scrollTop = 0;
    if (!this.isFocus) return;
    this.isFocus = false;
    this.emit("blur");
    this.inputContainer.blur();
  }
  /**
   * 刷新UI
   */
  flushUI() {
    if (this.bg) {
      if (this.isFocus) {
        this.bg.color = "#94d8ff";
      } else {
        this.bg.color = "#ffffff";
      }
    }
    if(this.inputContainer){
      this.inputContainer.style.display = !this.isDestroy && this.worldVisible?"block":"none";
    }
  }

  /**
   * 当前控件的点击
   */
  cilck() {
    this.focus();
  }

  /**
   * window的点击，为了点击别处  失去焦点
   * @param event 
   */
  private windowClick(event: any) {
    event = event || window.event;
    let p = new PIXI.Point(event.offsetX, event.offsetY);
    if (event.changedTouches && event.changedTouches[0]) {
      let t = event.changedTouches[0];
      let x = t.clientX;
      let y = t.clientY;
      let offsetLeft = t.target ? t.target.offsetLeft : 0;
      if (isNaN(offsetLeft)) {
        offsetLeft = 0;
      }
      let offsetTop = t.target ? t.target.offsetTop : 0;
      if (isNaN(offsetTop)) {
        offsetTop = 0;
      }
      p = new PIXI.Point(x - offsetLeft, y - offsetTop);
    }

    let iscontains = this.bg.containsPoint(p);

    if (iscontains || p.x<this.width || p.y<this.height) {
      // this.focus();
    } else {
      this.blur();
    }
  }
  onUpdate(dt:number){
    this.updateInputSize();
  }
  onWorldChageActive(worldActive:boolean){
    this.updateInputSize();
  }
  /**
   * 更新  输入框大小  位置等
   */
  updateInputSize() {
    if(!this.inputRootContainer || !this.inputContainer){
      return;
    }
    this.inputRootContainer.style.top = GameApplication.getInstance().application.view.style.marginTop;
    this.inputRootContainer.style.left = GameApplication.getInstance().application.view.style.marginLeft;
    let p = this.bg.toGlobal(new PIXI.Point(0,0))
    this.inputContainer.style.width = (this.width*this.bg.worldTransform.a) + "px";
    this.inputContainer.style.height = (this.height*this.bg.worldTransform.d) + "px";
    this.inputContainer.style.position = "absolute";
    this.inputContainer.style.border = "none";
    this.inputContainer.style.outline = "none";
    this.inputContainer.style.left = p.x + "px";
    this.inputContainer.style.top = p.y + "px";
    this.inputContainer.style.backgroundColor = "rgba(0,0,0,0)";
    this.fontSize = this.fontSize;
    // console.log("kkkkkk",this.bg.worldTransform,p,AVGBuilder.builder().mAVGConfig.version)
    this.flushUI();
  }



  /**
   * 设置宽度
   */
  set width(width: number) {
    this._width = width;
    this.bg.width = width;
    this.x = this.x;
  }
  get width(): number {
    return this._width;
  }
  /**
   * 设置高度
   */
  set height(height: number) {
    this._height = height;
    this.bg.height = height;
    if(this.label){
      this.label.y = height*0.5;
    }
    this.y = this.y;
  }
  get height(): number {
    return this._height;
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
   * 删除事件
   */
  removeEvents() {
    super.removeEvents();
    window.removeEventListener("touchstart", this._windowClick);
    window.removeEventListener("touchend", this._windowClick);
    this.inputContainer.onblur = ()=>{};
    this.inputContainer.onfocus = ()=>{};
    this.inputContainer.onchange = ()=>{};
    this.inputContainer.onkeydown = ()=>{};
    this.inputContainer.onkeypress = ()=>{};
    this.inputContainer.onkeyup = ()=>{};
  }
  /**
   * 销毁
   */
  destroy() {
    this.inputRootContainer.removeChild(this.inputContainer);
    super.destroy();
  }
}
