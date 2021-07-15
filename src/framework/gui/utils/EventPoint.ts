import {  Point } from "pixi.js";
import { EventEmitter } from "eventemitter3";
export class EventPoint extends Point {
  public event!:any;
  _x:number = 0;
  _y:number = 0;
  constructor(){
    super();
    this.event = new EventEmitter();
  }
  set x(x: number) {
    this._x = x ;
    this.emit("chageX");
  }
  get x(): number {
    return this._x;
  }
  set y(y: number) {
    this._y = y;
    this.emit("chageY");
  }
  get y(): number {
    return this._y;
  }

  /**
   * 使用时  一定要注意销毁
   * @param name
   * @param fn
   * @param context
   */
  public on(
    name: string,
    fn:  Function,
    context?: any
  ) {
    this.event.on(name, fn, context);
  }
  public emit(event: string, ...args: Array<any>) {
    this.event && this.event.emit(event, ...args);
  }
  public off(
    name: string,
    fn?: Function,
    context?: any
  ) {
    this.event.off(name, fn, context);
  }
}