import { Container, DisplayObject, Point, utils } from "pixi.js";
import { EventManager } from "../event/EventManager";
import { Timer } from "../timer/Timer";
import { Image } from "../gui/components/Image";
import { Canvas } from "../gui/components/Canvas";
import { Action } from "../animation/Action";
import { ActionSet } from "../animation/ActionSet";
import { Log } from "../log/Log";
import { GameApplication } from "./GameApplication";
import { UUIDUtils } from "../utils/UUIDUtils";
import { Button } from "../gui/components/Button";
import { BaseCollider } from "../collider/BaseCollider";
/**
 * 基本的容器
 */
export class Component extends Container {
  public static ZERO: PIXI.Point = new PIXI.Point(0, 0);
  componentId: string;
  isComponent: boolean = true;
  //是否为插槽
  isSlot: boolean = false;
  slotComponentId!: string;
  _active!: boolean;
  isDestroy: boolean = false;
  protected _color!: number | string;

  _componentMask: Image | Canvas | undefined | null;
  scheduleIDList: Array<string> = new Array();
  mActionSet: ActionSet | undefined;
  private _reverseMask: boolean = false;
  /**
   * 碰撞
   */
  private _collider: BaseCollider | undefined;
  constructor() {
    super();
    this.componentId = UUIDUtils.getUUID();
    this.sortableChildren = true;
    this.sortDirty = true;
    // this.interactive = true;
    this.active = true;

    this.draw();
    this.handleEvents();
  }
  set color(color: number | string) {
    if (typeof color == "string") {
      (<any>this).tint = utils.string2hex(color);
    } else {
      (<any>this).tint = color;
    }
  }
  get color(): number | string {
    if (this._color == undefined) {
      return (<any>this).tint;
    }
    return this._color;
  }
    /**
   * 是否为反向遮罩
   */
  set reverseMask(reverseMask:boolean){
    this._reverseMask = reverseMask;
  }
  get reverseMask():boolean{
    return !!this._reverseMask;
  }
  /**
   * 遮罩，建议用此遮罩
   */
  get componentMask(): Image | Canvas | undefined | null {
    return this._componentMask;
  }
  set componentMask(mask: Image | Canvas | undefined | null) {
    if (this.componentMask) {
      this.removeChild((<any>this).componentMask);
    }
    this._componentMask = mask;
    if (!mask) {
      return;
    }
    if(mask.getDisplayComponent){
      (<any>this).mask = mask.getDisplayComponent();
    }else{
      (<any>this).mask = mask;
    }
    this.addChild(mask);
  }
  get active(): boolean {
    return this._active;
  }
  set active(active: boolean) {
    this._active = active;
    this.visible = active;
    active ? this.activated() : this.deactivated();
    this._changeonWorldChageActive();
  }
  private _changeonWorldChageActive(){
    this.onWorldChageActive(this.worldVisible);
    this.children.forEach((element: DisplayObject) => {
      let view = <Component> <unknown>element;
      if(view._changeonWorldChageActive){
        view._changeonWorldChageActive();
      }
    });
  }


  get worldActive(): boolean {
    return this.worldVisible;
  }

  /**
   * 手动调用点击
   */
  manualClick(){
    let e = {
      stopped:false,
      target:undefined,
      currentTarget:undefined,
      type:"click",
      data:{
        global:new Point(0,0),
        target:undefined,
        originalEvent:undefined,
        identifier:0,
        isPrimary:false,
        button:1,
        buttons:0,
        width:0,
        height:0,
        tiltX:0,
        tiltY:0,
        pointerType:"click",
        pressure:0,
        rotationAngle:0,
        twist:0,
        tangentialPressure:0,
        pointerId:0,
        getLocalPosition:(displayObject: PIXI.DisplayObject, point?: PIXI.Point, globalPos?: PIXI.Point): PIXI.Point=>{return new Point()},
        copyEvent:(event: Touch | MouseEvent | PointerEvent)=>{},
        reset:()=>{}
      },
      stopPropagation:()=>{},
      reset:()=>{}
    }
    if(this.interactive && this.active){
      if(this.listenerCount(EventManager.TOUCH_CLICK)>0){
        this.emit(EventManager.TOUCH_CLICK,e);
      }else if(this.listenerCount(EventManager.MOUSE_CLICK)>0){
        this.emit(EventManager.MOUSE_CLICK,e);
      }
    }
  }

  /**
   * 全局Active改变
   */
  onWorldChageActive(worldActive: boolean) {}

  /**
   * 碰撞
   */
  set collider(collider:BaseCollider|undefined){
    if(this._collider == collider){
      return;
    }
    if(this._collider){
      this._collider.component = undefined;
    }
    if(collider){
      collider.component = this;
    }
    this._collider = collider
  }

  get collider():BaseCollider|undefined{
    return this._collider;
  }

  set rotate(rotate: number) {
    this.rotation = Math.PI * 2 * (rotate / 360);
  }
  get rotate(): number {
    return (this.rotation / (Math.PI * 2)) * 360;
  }
  set opacity(opacity: number) {
    this.alpha = opacity / 255;
  }
  get opacity(): number {
    return this.alpha * 255;
  }

  private _maskComponent: Image | Canvas | null = null;
  set maskComponent(image: Image | Canvas | null) {
    if (this._maskComponent) {
      if ((<any>this)._maskComponent.__isImage) {
        this.removeChild((<any>this)._maskComponent);
      }
      this.removeChild(this._maskComponent.getDisplayComponent());
    }
    this._maskComponent = image;
    if (image == null) {
      this.mask = null;
      return;
    }
    this.mask = image.getDisplayComponent();
    if (image && (<any>image).__isImage) {
      this.addChild(image);
    }
    // Log.info("jdghsdjasghdjkas",typeof image)
  }
  get maskComponent(): Image | Canvas | null {
    return this._maskComponent;
  }

  update = (deltaMS: number) => {
    if (this.isDestroy) return;
    if (!this.active) {
      return;
    }
    this.onUpdate(deltaMS);
    this.children.forEach((element: DisplayObject) => {
      (<any>element).update && (<any>element).update(deltaMS);
      // Log.debug("ddddd",deltaMS);
    });
  };
  resize = () => {
    this.onResize();
    this.children.forEach((element: DisplayObject) => {
      (<any>element).resize && (<any>element).resize();
    });
  };
  onResize() {}
  /**
   * 游戏主循环
   * @param deltaMS dt
   */
  onUpdate(deltaMS: number) {}
  /**
   * 被添加之后调用
   */
  onInit() {}
  /**
   * 激活时调用
   */
  activated() {}
  /**
   * 停用时调用
   */
  deactivated() {}
  /**
   * 场景被销毁调用
   */
  onDestroy() {}
  addCurrElement() {
    // this.active = true;
    this.onInit();
  }

  draw() {}
  handleEvents() {}

  _worldScale = { x: 1, y: 1 };
  _worldLocation = { x: 0, y: 0 };
  /**
   * 获取当前组件世界坐标内的缩放值
   */
  get worldScale(): { x: number; y: number } {
    this._worldScale.x = this.scale.x;
    this._worldScale.y = this.scale.y;
    let view = <Container>(<unknown>this);
    let index = 0;
    let maxLength = 10000;
    while (view.parent != undefined) {
      index++;
      if (index > 10000) {
        throw new Error("worldScale获取父节点异常，当前父节点大于" + maxLength);
      }
      this._worldScale.x *= view.scale.x;
      this._worldScale.y *= view.scale.y;
      view = view.parent;
    }
    return this._worldScale;
  }

  /**
   * 拿到当前组件的游戏内全局位置
   */
  get worldLocation(): { x: number; y: number } {
    let psx = 1;
    let psy = 1;
    if (this.parent) {
      psx = this.parent.scale.x;
      psy = this.parent.scale.y;
    }
    this._worldLocation.x = this.x * psx;
    this._worldLocation.y = this.y * psy;
    let view = <Container>(<unknown>this);
    let index = 0;
    let maxLength = 10000;
    while (view.parent != undefined) {
      psx = 1;
      psy = 1;
      if (view.parent.parent) {
        psx = view.parent.parent.scale.x;
        psy = view.parent.parent.scale.y;
      }
      index++;
      if (index > 10000) {
        throw new Error(
          "worldLocation获取父节点异常，当前父节点大于" + maxLength
        );
      }
      // Log.info("hehehehe");
      this._worldLocation.x += view.x * psx;
      this._worldLocation.y += view.y * psy;
      view = view.parent;
    }
    return this._worldLocation;
  }
  /**
   * 场景宽度
   */
  get sceneWidth(): number {
    return GameApplication.getSceneWidth();
  }
  /**
   * 场景高度
   */
  get sceneHeight(): number {
    return GameApplication.getSceneHeight();
  }

  /**
   * 获取当前容器居于屏幕左边的距离
   * 前提：当前必须有父控件
   * @param left
   */
  getPaddingScreenLeftValue(left?: number): number {
    if ( left == undefined || isNaN(left)) {
      left = 0;
    }
    if (!this.parent) {
      return left;
    }
    left = left * GameApplication.getInstance().ratio.x;
    let anchorX = (<any>this).anchor ? (<any>this).anchor.x : 0;
    let scaleX = Math.abs(this.scale.x);
    let p = new Point(left);
    return this.parent.toLocal(p).x + anchorX * this.width * scaleX;
  }
  /**
   * 获取当前容器居于屏幕右边的距离
   * 前提：当前必须有父控件
   * @param right
   */
  getPaddingScreenRightValue(right?: number): number {
    if (right == undefined || isNaN(right)) {
      right = 0;
    }
    if (!this.parent) {
      return right;
    }
    let scaleX = Math.abs(this.scale.x);
    return (
      this.getPaddingScreenLeftValue(this.sceneWidth - right) -
      this.width * scaleX
    );
  }
  /**
   * 获取当前容器居于屏幕上边的距离
   * 前提：当前必须有父控件
   * @param top
   */
  getPaddingScreenTopValue(top?: number): number {
    if (top == undefined || isNaN(top)) {
      top = 0;
    }
    if (!this.parent) {
      return top;
    }
    top = top * GameApplication.getInstance().ratio.y;
    let anchorY = (<any>this).anchor ? (<any>this).anchor.y : 0;
    let scaleY = Math.abs(this.scale.y);
    let p = new Point(0, top);
    return this.parent.toLocal(p).y + anchorY * this.height * scaleY;
  }
  /**
   * 获取当前容器居于屏幕下边的距离
   * 前提：当前必须有父控件
   * @param bottom
   */
  getPaddingScreenBottomValue(bottom?: number): number {
    if (bottom == undefined ||isNaN(bottom)) {
      bottom = 0;
    }
    if (!this.parent) {
      return bottom;
    }
    let scaleY = Math.abs(this.scale.y);
    return (
      this.getPaddingScreenTopValue(this.sceneHeight - bottom) -
      this.height * scaleY
    );
  }

  /**
   * 把当前控件设置到屏幕左边
   * 前提：当前必须有父控件
   * @param left
   */
  paddingScreenLeft(left?: number) {
    this.x = this.getPaddingScreenLeftValue(left);
  }
  /**
   * 把当前控件设置到屏幕右边
   * 前提：当前必须有父控件
   * @param right
   */
  paddingScreenRight(right?: number) {
    this.x = this.getPaddingScreenRightValue(right);
  }
  /**
   * 把当前控件设置到屏幕上边
   * 前提：当前必须有父控件
   * @param top
   */
  paddingScreenTop(top?: number) {
    this.y = this.getPaddingScreenTopValue(top);
  }
  /**
   * 把当前控件设置到屏幕下边
   * 前提：当前必须有父控件
   * @param bottom
   */
  paddingScreenBottom(bottom?: number) {
    this.y = this.getPaddingScreenBottomValue(bottom);
  }
  // currEventList: Array<string> = new Array();
  currEventList: Map<string, Map<Function, boolean>> = new Map();
  on(event: string, fn: Function, context?: any) {
    if (this.isDestroy) return;
    if (EventManager.includeEvent(event)) {
      this.interactive = true;
    }
    let map = this.currEventList.get(event);
    if (!map) {
      map = new Map();
      this.currEventList.set(event, map);
    }
    // if(){}
    map.set(fn, true);
    // this.currEventList.push(event);
    super.on(event, fn, context);
  }
  off(event: "added" | "removed" | string, fn?: Function, context?: any) {
    if (!fn) {
      this.currEventList.get(event)?.clear();
      this.currEventList.delete(event);
    } else {
      let map = this.currEventList.get(event);
      if (map) {
        map.delete(fn);
        if (map.size == 0) {
          this.currEventList.delete(event);
        }
      }
    }
    let interactive = false;
    this.currEventList.forEach((v, k) => {
      if (EventManager.includeEvent(k)) {
        interactive = true;
      }
    });
    if (!interactive) {
      this.interactive = interactive;
    }
    super.off(event, fn, context);
  }
  removeEvents() {
    this.currEventList.forEach((v, k) => {
      this.off(k);
    });
    this.currEventList.clear();
  }

  /**
   * 执行动画
   * @param animation
   */
  runAction(animation: Function) {
    if (this.isDestroy) return;
    this.stopAction();
    this.mActionSet = new ActionSet(this, animation);
    this.mActionSet.start();
  }
  /**
   * 停止动画
   */
  stopAction() {
    if (this.mActionSet) {
      this.mActionSet.stop();
      this.mActionSet = undefined;
    }
  }

  /**
   * 计时器 每time毫秒执行一次回调
   * 执行多次
   * @param callback
   * @param time
   */
  schedule(callback: Function, time: number) {
    if (this.isDestroy) return;
    if (isNaN(time)) {
      callback && callback();
    }
    let self = this;
    let id = Timer.setInterval(() => {
      callback && callback();
    }, time);
    callback._scheduleid = id;
    self.scheduleIDList.push(id);
  }
  /**
   * 计时器  time毫秒之后  执行一次回调
   * 执行一次
   * @param callback
   * @param time
   */
  scheduleOne(callback: Function, time: number) {
    if (this.isDestroy) return;
    if (time <= 0 || isNaN(time)) {
      callback && callback();
      return;
    }
    let self = this;
    let id = Timer.setTimeout(() => {
      this.scheduleIDList.remove(id);
      callback && callback();
    }, time);
    callback._scheduleid = id;
    self.scheduleIDList.push(id);
  }
  /**
   * 移除一个计时器
   * @param callback
   */
  unschedule(callback: Function) {
    if (callback && callback._scheduleid) {
      this.scheduleIDList.remove(callback._scheduleid);
      Timer.clearTimer(callback._scheduleid);
    }
  }
  /**
   * 移除全部计时器
   */
  unscheduleAll() {
    for (let i = 0; i < this.scheduleIDList.length; i++) {
      let id = this.scheduleIDList[i];
      this.scheduleIDList.remove(id);
      Timer.clearTimer(id);
      i--;
    }
    this.scheduleIDList.length = 0;
  }
  /**
   * 根据 componentId 来查找当前节点下的子节点（单层，无法查找孙子节点） Component
   * @param id
   */
  getComponentById(id: string): Component | undefined {
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i].componentId == id) {
        return this.children[i];
      }
    }
    return;
  }
  /**
   * 根据 componentId 来查找当前节点下的所有节点 Component
   * 极其耗性能
   * @param id
   */
  findComponent(id: string): Component | undefined {
    let component = this.getComponentById(id);
    if (component) {
      return component;
    }
    for (let i = 0; i < this.children.length; i++) {
      let view = this.children[i];
      if (view && view.findComponent) {
        component = view.findComponent(id);
      }
      if (component) {
        return component;
      }
    }
    return;
  }
  /**
   * 添加元素
   */
  addChild(element: DisplayObject | Component) {
    if (this.children.indexOf(element) != -1) {
      Log.warn("当前节点被父节点重复添加！");
      return;
    }
    if (element.parent == this || element.parent != null) {
      Log.warn("当前节点被父节点重复添加！");
      return;
    }
    if (element.parent != null) {
      throw new Error("当前节点已经有了父节点  无法再次被添加！");
    }
    super.addChild(element);
    if (element instanceof Component) {
      element.addCurrElement();
    }
  }
  /**
   * 添加元素
   */
  addChildAt(element: DisplayObject | Component, index: number) {
    if (this.children.indexOf(element) != -1) {
      Log.warn("当前节点被父节点重复添加！");
      return;
    }
    if (element.parent == this || element.parent != null) {
      Log.warn("当前节点被父节点重复添加！");
      return;
    }
    if (element.parent != null) {
      throw new Error("当前节点已经有了父节点  无法再次被添加！");
    }
    super.addChildAt(element, index);
    if (element instanceof Component) {
      element.addCurrElement();
    }
  }

  /**
   * 从父结点删除此节点
   */
  removeFromParent() {
    if (this.parent != null) {
      this.parent.removeChild(this);
    }
  }
  /**
   * 移除全部节点
   */
  removeAllChild() {
    for (let i = 0; i < this.children.length; i++) {
      this.removeChildAt(i);
      i--;
    }
  }
  destroy(options?: {
    children?: boolean;
    texture?: boolean;
    baseTexture?: boolean;
  }) {
    if (this.isDestroy) {
      return;
    }
    if (this.maskComponent) {
      this.maskComponent.destroy(options);
    }
    if(this.collider){
      this.collider.destroy();
      this.collider = undefined;
    }
    this.maskComponent = null;
    this.mask = null;
    this.isDestroy = true;
    this.onDestroy();
    if (Array.isArray(this.filters)) {
      this.filters.length = 0;
    }
    this.unscheduleAll();
    this.stopAction();
    let viewArr = new Array();
    viewArr.push(...this.children)
    for (let i = 0; i < viewArr.length; i++) {
      let view = viewArr[i];
      this.removeChild(view);
      // this.removeChild(view);
      // i--;
      view.destroy(options);
    }
    viewArr.clear();
    this.children.clear();
    this.removeFromParent();
    this.removeEvents();
    super.destroy();
  }
  destroyChildres(options?: {
    children?: boolean;
    texture?: boolean;
    baseTexture?: boolean;
  }) {
    if(!options){
      options = {children:true};
    }
    if(options.children == undefined){
      options.children = true;
    }
    for (let i = 0; i < this.children.length; i++) {
      let component = this.children[i];
      this.removeChild(component);
      // this.children.remove(component);
      component.destroy(options);
      i--;
    }
    this.children.length = 0;
  }
}
