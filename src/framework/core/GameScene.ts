import { Component } from "./Component";
import * as PIXI from "pixi.js";
import { GameApplication } from "./GameApplication";
import { Log } from "../log/Log";
import { Image } from "../gui/components/Image";
/**
 * 游戏场景
 */
export class GameScene {
  container: PIXI.Container = new PIXI.Container();
  rootElement: Component = new Component();
  isDestroy: boolean = false;

  set x(x: number) {
    this.rootElement.x = x;
  }
  get x(): number {
    return this.rootElement.x;
  }
  set y(y: number) {
    this.rootElement.y = y;
  }
  get y(): number {
    return this.rootElement.y;
  }
  get sceneWidth(): number {
    return GameApplication.getSceneWidth();
  }
  get sceneHeight(): number {
    return GameApplication.getSceneHeight();
  }

  update = (deltaMS: number) => {
    this.onUpdate(deltaMS);
    this.rootElement.update(deltaMS);
  };
  resize = ()=>{
    this.onResize();
    this.rootElement.resize();
  }
  onResize(){}

  /**
   * 游戏主循环
   * @param deltaMS dt
   */
  onUpdate(deltaMS: number) {}
  /**
   * 被添加之后调用
   */
  onInit(...obj: any) {}

  /**
   * 场景被销毁调用
   */
  onDestroy() {}

  init(...obj: any) {
    this.rootElement.active = true;
    this.container.addChild(<any>this.rootElement);
    this.onInit(...obj);
  }

  /**
   * 添加元素
   */
  addComponent(element: Component) {
    this.rootElement.addChild(element);
  }
  /**
   * 删除元素
   */
  removeComponent(element: Component) {
    this.rootElement.removeChild(<any>element);
  }

  /**
   * 计时器 每time毫秒执行一次回调
   * 执行多次
   * @param callback
   * @param time
   */
  schedule(callback: Function, time: number) {
    this.rootElement.schedule(callback, time);
  }
  /**
   * 计时器  time毫秒之后  执行一次回调
   * 执行一次
   * @param callback
   * @param time
   */
  scheduleOne(callback: Function, time: number) {
    this.rootElement.scheduleOne(callback, time);
  }
  /**
   * 移除一个计时器
   * @param callback
   */
  unschedule(callback: Function) {
    this.rootElement.unschedule(callback);
  }
  /**
   * 移除全部计时器
   */
  unscheduleAll() {
    this.rootElement.unscheduleAll();
  }

  on(event: string, fn: Function, context?: any) {
   this.rootElement.on(event,fn,context);
  }
  off(event: "added" | "removed" | string, fn?: Function, context?: any) {
    this.rootElement.off(event,fn,context);
  }
  toLocal(position: PIXI.IPoint, from?: PIXI.DisplayObject, point?: PIXI.Point, skipUpdate?: boolean): PIXI.IPoint{
    return this.rootElement.toLocal(position,from,point,skipUpdate);
  }
  /**
   * 清除显卡内图片所占用的缓存
   */
  dispose(){
    this.rootElement.children.forEach(v=>{
      this.disposeChildren(<any>v);
    })
  }

  private disposeChildren(view:Component){
    if(view.isSprite){
      let img = <Image><unknown>view;
      if(img.texture && img.texture.valid){
        img.texture.baseTexture.dispose();
      }
    }
    if(Array.isArray(view.children)){
      view.children.forEach(v=>{
        this.disposeChildren(<any>v);
      })
    }
  }
  /**
   * 销毁场景
   */
  destroy() {
    // let options={children:true,texture:true,baseTexture:true};
    if(this.isDestroy){
      return;
    }
    this.dispose();
    this.isDestroy = true;
    this.unscheduleAll();
    this.onDestroy();
    // for (let key in this) {
    //   this[key] && this[key].unbind && this[key].unbind();
    // }
    if (this.container.parent) {
      this.container.parent.removeChild(this.container);
    }
    this.rootElement.destroy({children:true});
    this.container.destroy({children:true});
  }
}
