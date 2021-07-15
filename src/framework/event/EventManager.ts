import { EventEmitter } from "eventemitter3";
import * as PIXI from "pixi.js";
let PIXIInteractionEvent = PIXI.InteractionEvent;
if((<any>PIXI).interaction != undefined){
  PIXIInteractionEvent = (<any>PIXI).interaction.InteractionEvent;
}
export class InteractionEvent extends PIXIInteractionEvent {}


export class EventManager {
  private static event = new EventEmitter();

  public static NET_ERROR:string = "net_error";
  public static NET_RECOVER:string = "net_recover";

  //*** 手机 ***
  //点击
  public static TOUCH_CLICK: string = "tap";
  //按下
  public static TOUCH_START: string = "touchstart";
  //移动
  public static TOUCH_MOVE: string = "touchmove";
  //区域内松开
  public static TOUCH_END: string = "touchend";
  //区域外松开
  public static TOUCH_CANCEL: string = "touchendoutside";
  //*** 电脑 ***
  //点击
  public static MOUSE_CLICK: string = "click";
  //鼠标按下
  public static MOUSE_DOWN: string = "mousedown";
  //鼠标移动
  public static MOUSE_MOVE: string = "mousemove";
  //鼠标区域内松开
  public static MOUSE_UP: string = "mouseup";
  //鼠标区域外松开
  public static MOUSE_UPOUTSIDE: string = "mouseupoutside";
  //*** 手机+电脑 ***
  //点击
  public static ALL_CLICK: string = "tap+click";
  //按下
  public static ALL_START: string = "touchstart+mousedown";
  //移动
  public static ALL_MOVE: string = "touchmove+mousemove";
  //区域内松开
  public static ALL_END: string = "touchend+mousemove";
  //区域外松开
  public static ALL_CANCEL: string = "touchendoutside+mouseup";


  //资源加载异常
  public static LOADING_ERROR:string = "loadingError";

  public static includeEvent(eventName: string): boolean {
    for (let key in EventManager) {
      let value = (<any>EventManager)[key];
      if (typeof value == "string" && value == eventName) {
        return true;
      }
    }
    return false;
  }

  public static eventIncludes(name: string): boolean {
    return EventManager.event.listenerCount(name) > 0;
  }
  /**
   * 使用时  一定要注意销毁
   * @param name
   * @param fn
   * @param context
   */
  public static on(
    name: string,
    fn: Function,
    context?: any
  ) {
    EventManager.event.on(name, <any>fn, context);
  }
  public static once(
    name: string,
    fn:  Function,
    context?: any
  ) {
    EventManager.event.once(name, <any>fn, context);
  }
  public static emit(event: string, ...args: Array<any>) {
    EventManager.event.emit(event, ...args);
  }
  public static off(
    name: string,
    fn?:  Function,
    context?: any
  ) {
    EventManager.event.off(name, <any>fn, context);
  }
  public static offAll() {
    let names = EventManager.event.eventNames();
    if (Array.isArray(names)) {
      names.forEach((name) => {
        EventManager.event.removeAllListeners(name);
      });
    }
  }
}
