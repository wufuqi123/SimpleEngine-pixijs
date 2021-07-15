import { Component } from "../../core/Component";
import { Label } from "./Label";
import { Image } from "./Image";
import { Action } from "../../animation/Action";
import { Canvas } from "./Canvas";
import { GameTexture } from "../GameTexture";
export class Toast extends Component {
  /**
   * 短时长
   */
  public static LENGTH_SHORT:number = 1000;
  /**
   * 长时长
   */
  public static LENGTH_LONG:number = 3000;
  /**
   * 顶对其
   */
  public static TOP:number = 0;
  /**
   * 中心对齐
   */
  public static CENTER:number = 1;
  /**
   * 底对齐
   */
  public static BOTTOM:number = 2;
  textView: Label;
  isShow: boolean = false;
  fadeTime: number = 300;
  showTime: number = 300;
  bg: Image;
  constructor() {
    super();
    this.opacity = 0;
    window.app.rootComponent.addChild(this);
    
    this.componentMask = new Canvas();
    this.bg = new Image();
    this.addChild(this.bg);
    this.bg.texture = GameTexture.WHITE;
    this.bg.color = "#000000";
    this.bg.opacity = 150;
    this.bg.anchor.set(0.5);

    this.textView = new Label();
    this.addChild(this.textView);
    this.textView.color = "#ffffff";
    this.textView.anchor.set(0.5);
    this.setGravity(Toast.BOTTOM);
    this.zIndex = 99999;
  }
  /**
   * 设置文本
   * @param text 
   */
  setText(text: string): Toast {
    this.textView.text = text;
    this.bg.width = this.textView.width + 50;
    this.bg.height = this.textView.height + 10;
    if(this.componentMask){
      this.componentMask.clear();
      this.componentMask.beginFill(0x000000);
      this.componentMask.drawRoundedRect(-this.bg.width / 2, -this.bg.height / 2, this.bg.width, this.bg.height, 20);
      this.componentMask.endFill();
    }
    return this;
  }
  /**
   * 显示
   * @param duration 持续事件
   */
  show(duration?:number) : Toast{
    if(isNaN(duration)){
      duration = this.showTime;
    }
    if (!this.isShow) {
      this.stopAction();
      this.isShow = true;
      this.runAction(Action.fadeIn(this.fadeTime));
    }
    this.unscheduleAll();
    this.scheduleOne(() => {
      this.isShow = false;
      this.runAction(Action.fadeOut(this.fadeTime));
    }, duration + this.fadeTime);
    return this;
  }
  /**
   * 设置位置
   * @param align 对齐方式
   * @param x 偏移
   * @param y 偏移
   */
  setGravity(align:number,x=0,y=200) : Toast{
    this.x = this.sceneWidth/2 + x;
    if(align == Toast.CENTER){
      this.y = this.sceneHeight/2-y;
    }else if(align == Toast.TOP){
      this.paddingScreenTop(y);
    }else if(align == Toast.BOTTOM){
      this.paddingScreenBottom(y);
    }
    return this;
  }

  /**
   * 创建  toast
   * @param text 文本
   * @param duration 持续事件
   */
  static makeText(text:string,duration?:number) : Toast{
    let toast = new Toast();
    toast.setText(text);
    if(isNaN(duration)){
      toast.showTime = Toast.LENGTH_LONG;
    }else{
      toast.showTime = duration;
    }
    return toast;
  }
}
