import { EventManager } from "../../event/EventManager";
import { Radio } from "./Radio";
/**
 * 阻挡类型
 */
export enum RadioResistType{
  /**
   * 不阻挡
   */
  NORMAL = 0,
  /**
   * 水平阻挡
   */
  HORIZONTAL,
  /**
   * 垂直阻挡
   */
  VERTICAL,
  /**
   * 全部方向阻挡
   */
  ALL,
}
/**
 * 单选框  可在  Scroller组件下使用
 */
export class RadioResist extends Radio {
  mStartY!: number;
  isClick!: boolean;
  mStartX!: number;

  /**
   * x 阻挡值
   */
  resistX = 10;
  /**
   * y 阻挡值
   */
  resistY = 10;
  /**
   * 阻挡值
   */
  set resist(resist:number){
    this.resistX = resist;
    this.resistY = resist;
  }

  /**
   * 阻挡类型  默认不阻挡
   */
  resistType:RadioResistType = RadioResistType.NORMAL;


  /**
   * 设置事件
   */
  handleEvents() {
    this.on(EventManager.ALL_START, this.onStart);
    this.on(EventManager.ALL_MOVE, this.onMove);

    this.on(EventManager.ALL_END, this.onEnd);
    this.on(EventManager.ALL_CANCEL, this.onReset);
  }
  onStart(event:PIXI.InteractionEvent){
    this.mStartY =  this.toLocal(event.data.global).y;
    this.mStartX =  this.toLocal(event.data.global).x;
    this.isClick = true;
  }
  onMove(event:PIXI.InteractionEvent){
    if(!this.isClick || this.resistType == RadioResistType.NORMAL){return}
    if(this.resistType == RadioResistType.HORIZONTAL || this.resistType == RadioResistType.ALL){
      if(Math.abs(this.toLocal(event.data.global).x-this.mStartX)>this.resistX){
        this.onReset();
        return;
      }
    }
    if(this.resistType == RadioResistType.VERTICAL || this.resistType == RadioResistType.ALL){
      if(Math.abs(this.toLocal(event.data.global).y-this.mStartY)>this.resistY){
        this.onReset();
        return;
      }
    }

    event.stopPropagation();
  }
  onEnd(){
    if(this.isClick){
      this.onClicked();
    }
    this.isClick = false;
  }
  onReset(){
    this.isClick = false;
  }

  onClicked(){
    this.selected = !this.selected;
  }
}