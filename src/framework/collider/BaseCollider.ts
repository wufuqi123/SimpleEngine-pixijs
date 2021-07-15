import { EventEmitter } from "eventemitter3";
import { Component } from "../core/Component";
import { Log } from "../log/Log";
import { CircleUtils } from "../utils/CircleUtils";
import { UUIDUtils } from "../utils/UUIDUtils";
import { ColliderData, ColliderDataType } from "./ColliderData";
import { ColliderGroupManager } from "./ColliderGroupManager";
import { PonlygonUtils } from "./utils/PonlygonUtils";
/**
 * 基本的碰撞组件
 */
export class BaseCollider extends EventEmitter {
  /**
   * 只在两个碰撞体开始接触时被调用一次
   */
  public static EVENT_BEGIN: string = "EVENT_BEGIN";
  /**
   * 只在两个碰撞体结束接触时被调用一次
   */
  public static EVENT_END: string = "EVENT_END";
  /**
   * 每次将要处理碰撞体接触逻辑时被调用
   */
  public static EVENT_PRE: string = "EVENT_PRE";
  /**
   * 每次处理完碰撞体接触逻辑时被调用
   */
  public static EVENT_POST: string = "EVENT_POST";

  /**
   * 挂载的组件
   */
  protected mComponent: Component | undefined;
  /**
   * 碰撞数据
   */
  protected mColliderData!: ColliderData;

  protected mIsContactMap: Map<string, boolean> = new Map();
  /**
   * 碰撞组件名
   */
  protected _name: string = UUIDUtils.getUUID();
  protected _group!: string;
  /**
   * 碰撞组件名字
   */
  public get name(): string {
    return this._name;
  }
  /**
   * 是否开启碰撞
   */
  public active = true;

  /**
   * 设置碰撞数据
   */
  public set colliderData(colliderData: ColliderData) {
    this.mColliderData = colliderData;
  }

  public get colliderData(): ColliderData {
    return this.mColliderData;
  }

  /**
   * 拿取真实的是否开启碰撞
   */
  public get realActive(): boolean {
    if (!this.mComponent) {
      return false;
    }
    return this.active && this.mComponent.worldActive;
  }

  // protected mContactArray: Array<string> = new Array();


  public isDestroy = false;

  constructor() {
    super();
    this.group = "default";
    this.mColliderData = new ColliderData();
  }

  /**
   * 当前组
   */
  public set group(group: string) {
    if (this.group == group) {
      return;
    }
    ColliderGroupManager.remove(this);
    this._group = group;
    if (!this.isDestroy) {
      ColliderGroupManager.addCollider(this);
    }
  }

  public get group(): string {
    return this._group;
  }
  /**
   * 设置组件
   */
  public set component(component: Component | undefined) {
    if (this.mComponent == component) {
      return;
    }
    if (this.isDestroy) {
      throw new Error(`The collision has been destroyed!`);
    }
    this.mComponent = component;
  }
  public get component(): Component | undefined {
    return this.mComponent;
  }

  /**
    * 获取碰撞数据
    */
  public getColliderData(): ColliderData | undefined {
    if (!this.component) {
      return undefined;
    }
    if (this.colliderData.type == ColliderDataType.RECTANGLE) {
      if (!this.component.parent) {
        return undefined;
      }
      let p = this.component.parent.toGlobal(this.component.position)
      this.colliderData.rectangle.out.x = p.x
      this.colliderData.rectangle.out.y = p.y;
      this.colliderData.rectangle.source.width = this.component.width;
      this.colliderData.rectangle.source.height = this.component.height;
      if (this.colliderData.rectangle.out.width != this.colliderData.rectangle.source.width) {
        this.colliderData.rectangle.out.width = this.colliderData.rectangle.source.width;
      }
      if (this.colliderData.rectangle.out.height != this.colliderData.rectangle.source.height) {
        this.colliderData.rectangle.out.height = this.colliderData.rectangle.source.height;
      }
      if (this.colliderData.rectangle.out.height == 0 || this.colliderData.rectangle.out.width == 0) {
        return undefined;
      }
    }
    return this.mColliderData;
  }

  /**
   * 检测碰撞
   */
  public detection(collider: BaseCollider): boolean {
    if (
      !this.realActive ||
      !collider.realActive ||
      this.isDestroy ||
      !this.component
    ) {
      this.sendEvent(false, collider);
      return false;
    }
    let source = this.getColliderData();
    let target = collider.getColliderData();

    if (!source || !target) {
      this.sendEvent(false, collider);
      return false
    }
    if (
      source.type == ColliderDataType.NOTHING ||
      target.type == ColliderDataType.NOTHING
    ) {
      this.sendEvent(false, collider);
      return false;
    }
    let isDetection = false;
    if (
      source.type == ColliderDataType.RECTANGLE &&
      target.type == ColliderDataType.RECTANGLE
    ) {
      //2个矩形碰撞
      isDetection = this.rectangleDetection(source, target);
    } else if (
      source.type == ColliderDataType.ROUND &&
      target.type == ColliderDataType.ROUND
    ) {
      //2个圆碰撞
      isDetection = this.roundDetection(source, target);
    } else if (
      source.type == ColliderDataType.RECTANGLE &&
      target.type == ColliderDataType.ROUND
    ) {
      //1个圆1个矩形碰撞
      isDetection = this.roundAndRectangleDetection(target, source);
    } else if (
      source.type == ColliderDataType.ROUND &&
      target.type == ColliderDataType.RECTANGLE
    ) {
      //1个圆1个矩形碰撞
      isDetection = this.roundAndRectangleDetection(source, target);
    } else if (
      source.type == ColliderDataType.POLYGON &&
      target.type == ColliderDataType.POLYGON
    ) {
      //2个多边形碰撞
      isDetection = this.ponlygonDetection(source, target);
    } else if (
      source.type == ColliderDataType.RECTANGLE &&
      target.type == ColliderDataType.POLYGON
    ) {
      //1个多边形1个矩形碰撞
      isDetection = this.ponlygonAndRectangleDetection(target, source);
    } else if (
      source.type == ColliderDataType.POLYGON &&
      target.type == ColliderDataType.RECTANGLE
    ) {
      //1个多边形1个矩形碰撞
      isDetection = this.ponlygonAndRectangleDetection(source, target);
    }else if (
      source.type == ColliderDataType.POLYGON &&
      target.type == ColliderDataType.ROUND
    ) {
      //1个多边形1个圆形碰撞
      isDetection = this.ponlygonAndRoundDetection(source, target);
    }else if (
      source.type == ColliderDataType.ROUND &&
      target.type == ColliderDataType.POLYGON
    ) {
      //1个多边形1个圆形碰撞
      isDetection = this.ponlygonAndRoundDetection(target, source);
    }
    this.sendEvent(isDetection, collider);
    return isDetection;
  }

  /**
   * 矩形中的碰撞检测
   * @param source
   * @param target
   */
  protected rectangleDetection(
    data1: ColliderData,
    data2: ColliderData
  ): boolean {
    let source = data1.rectangle.out;
    let target = data2.rectangle.out;
    return (
      source.x + source.width >= target.x &&
      target.x + target.width >= source.x &&
      target.y + target.height >= source.y &&
      source.y + source.height >= target.y
    );
  }

  /**
    * 圆形中的碰撞检测
    * @param source
    * @param target
    */
  protected roundDetection(
    data1: ColliderData,
    data2: ColliderData
  ): boolean {
    let source = data1.circle.out;
    let target = data2.circle.out;
    return !(Math.pow((source.x - target.x), 2) + Math.pow((source.y - target.y), 2) > Math.pow(source.radius + target.radius, 2));
  }

  /**
    * 矩形和圆形中的碰撞检测
    * @param source
    * @param target
    */
  protected roundAndRectangleDetection(
    round: ColliderData,
    rectangle: ColliderData
  ): boolean {
    let source = round.circle.out;
    let target = rectangle.rectangle.out;
    let h = {
      x: target.width / 2,
      y: target.height / 2
    }
    //矩形中心点坐标
    let central = {
      //矩形中心点x坐标
      x: target.x + target.width / 2,
      //矩形中心点y坐标
      y: target.y + target.height / 2
    };
    // 获取圆心到矩形中心点的象限（x,y的差值）
    let v = {
      x: Math.abs(source.x - central.x),
      y: Math.abs(source.y - central.y),
    }
    //求圆心至矩形的最短距离矢量
    let u = {
      x: Math.max(v.x - h.x, 0),
      y: Math.max(v.y - h.y, 0),
    }
    return Math.pow(u.x, 2) + Math.pow(u.y, 2) <= source.radius * source.radius;
  }

  /**
    * 多边形中的碰撞检测
    * @param source
    * @param target
    */
  protected ponlygonDetection(
    data1: ColliderData,
    data2: ColliderData
  ): boolean {
    return PonlygonUtils.isCollide(data1.poLygon.out, data2.poLygon.out);
  }

  /**
   * 矩形和多边形中的碰撞检测
   * @param ponlygon 
   * @param rectangle 
   * @returns 
   */
  protected ponlygonAndRectangleDetection(
    ponlygon: ColliderData,
    rectangle: ColliderData
  ): boolean {
    let arr = new Array();
    arr.push(rectangle.rectangle.out.x, rectangle.rectangle.out.y);
    arr.push(rectangle.rectangle.out.x + rectangle.rectangle.out.width, rectangle.rectangle.out.y);
    arr.push(rectangle.rectangle.out.x + rectangle.rectangle.out.width, rectangle.rectangle.out.y + rectangle.rectangle.out.height);
    arr.push(rectangle.rectangle.out.x, rectangle.rectangle.out.y + rectangle.rectangle.out.height);
    return PonlygonUtils.isCollide(ponlygon.poLygon.out, arr);
  }

  /**
   * 多边形和圆形中的碰撞检测
   * @param ponlygon 
   * @param round 
   * @returns 
   */
  protected ponlygonAndRoundDetection(
    ponlygon: ColliderData,
    round: ColliderData
  ): boolean{
    let arr = new Array();
    //圆统一使用  36个点来代表多边形
    CircleUtils.getPath(round.circle.out.x,round.circle.out.y,round.circle.out.radius,10).forEach(v=>{
        arr.push(Math.floor(v.x),Math.floor(v.y));
    });
    return PonlygonUtils.isCollide(ponlygon.poLygon.out, arr);
  }

  /**
   * 只在两个碰撞体开始接触时被调用一次
   * @param collider
   */
  protected beginContact(collider: BaseCollider) {
    if (!this.mIsContactMap.get(collider.name)) {
      this.emit(BaseCollider.EVENT_PRE, this, collider);
      this.mIsContactMap.set(collider.name, true);
      this.emit(BaseCollider.EVENT_BEGIN, this, collider);
      this.emit(BaseCollider.EVENT_POST, this, collider);
    }
  }
  /**
   * 只在两个碰撞体结束接触时被调用一次
   * @param collider
   */
  protected endContact(collider: BaseCollider) {
    if (!this.mIsContactMap.get(collider.name)) {
      return;
    }
    this.emit(BaseCollider.EVENT_PRE, this, collider);
    this.mIsContactMap.set(collider.name, false);
    this.emit(BaseCollider.EVENT_END, this, collider);
    this.emit(BaseCollider.EVENT_POST, this, collider);
  }

  /**
   * 发送碰撞事件
   * @param isDetection
   * @param collider
   */
  public sendEvent(isDetection: boolean, collider: BaseCollider) {
    if (isDetection) {
      this.beginContact(collider);
    } else {
      this.endContact(collider);
    }
  }

  /**
   * 销毁
   */
  public destroy() {
    if (this.isDestroy) {
      return;
    }
    this.removeAllListeners();
    this.isDestroy = true;
    this.active = false;
    this.mComponent = undefined;
    ColliderGroupManager.remove(this);
  }
}
