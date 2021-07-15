import { Component } from "../../core/Component";
import { Log } from "../../log/Log";
import { EventPoint } from "../utils/EventPoint";
import { DisplayObject } from "pixi.js";
import { Button } from "./Button";
/**
 * Layout 控件
 */
export class Layout extends Component {
  public static LAYOUT = {
    HORIZONTAL: "HORIZONTAL",
    VERTICLE: "VERTICLE",
    TABLE: "TABLE",
  };
  public rootComponent: Component;
  protected _anchor: EventPoint;
  _layoutType: string;
  _gap: number = 0;
  _width: number = 0;
  _height: number = 0;
  _row: number = 0;
  _column: number = 0;
  protected _x: number = 0;
  protected _y: number = 0;
  constructor() {
    super();
    this.layoutType = Layout.LAYOUT.VERTICLE;
    this._anchor.on("chageX", () => {
      this.x = this.x;
    });
    this._anchor.on("chageY", () => {
      this.y = this.y;
    });
  }

  draw() {
    if(this.isDestroy) return;
    
    if (!this._anchor) {
      this._anchor = new EventPoint();
    }
    if (!this.rootComponent) {
      this.rootComponent = new Component();
      super.addChild(this.rootComponent);
    }
  }
  /**
   * 设置类型，是水平还是垂直
   */
  set layoutType(layoutType: string) {
    this._layoutType = layoutType;
    this.relayout();
  }
  get layoutType(): string {
    return this._layoutType;
  }
  /**
   * 间隔
   */
  set gap(gap: number) {
    this._gap = gap;
    this.relayout();
  }
  get gap(): number {
    return this._gap;
  }
  set width(width: number) {
    this._width = width;
    this.x = this.x;
  }
  get width(): number {
    return this._width;
  }
  set height(height: number) {
    this._height = height;
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

  set scale(scale: Point){
    this.rootComponent.scale = scale;
  }
  get scale(): Point{
    return this.rootComponent.scale;
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
   * 最后行的  列数（因为item的宽高不一样，所布局的行数和列数也都不相同）
   */
  get column(): number {
    return this._column;
  }
  /**
   * 最后一列的  行数（因为item的宽高不一样，所布局的行数和列数也都不相同）
   */
  get row(): number {
    return this._row;
  }
  /**
   * 重新设置子控件的x,y
   */
  relayout() {
    if(this.isDestroy) return;
    let currX = 0;
    let currY = 0;

    let maxItemHeight = 0;
    let maxItemWidth = 0;
    let row = 1;
    let column = 0;
    let maxColumn = 0;
    this.rootComponent.children.forEach((item: Button, i: number) => {

      let itemWidth = item.width;
      let itemHeight = item.height;
      if( this.layoutType != Layout.LAYOUT.TABLE){
        maxItemWidth = itemWidth > maxItemWidth ? itemWidth : maxItemWidth;
        maxItemHeight = itemHeight > maxItemHeight ? itemHeight : maxItemHeight;
      }
      item.x = currX;
      item.y = currY;
      let gap = 0;
      if (i != this.rootComponent.children.length - 1) {
        gap = this.gap;
      }
      if (
        this.layoutType == Layout.LAYOUT.HORIZONTAL
      ) {
        currX += itemWidth + gap;
        this._column = 1;
        this._row = this.rootComponent.children.length;
      } else if (
        this.layoutType == Layout.LAYOUT.VERTICLE
      ) {
        currY += itemHeight + gap;
        // Log.info("解析---2：",i,currY,itemHeight,gap)
        this._column = this.rootComponent.children.length;
        this._row = 1;
      } else {
        currX += itemWidth + this.gap;
        if (this.width < currX - this.gap) {
          currX = 0;
          maxColumn = maxColumn < column ? column : maxColumn;
          currY += maxItemHeight + this.gap;
          // Log.info("解析---2：",i,maxItemHeight)
          maxItemHeight = 0;
          maxItemWidth = 0;
          column = 0;
          if(i == 0){
            currX = 0;
            currY = 0;
          }else{
            row++;
          }
          item.x = currX;
          item.y = currY;
          currX = itemWidth + this.gap;
        }
        maxItemWidth = itemWidth > maxItemWidth ? itemWidth : maxItemWidth;
        maxItemHeight = itemHeight > maxItemHeight ? itemHeight : maxItemHeight;
        column++;
        }
      });
      // Log.info("解析---2：",maxItemHeight)
    // Log.info("解析---：",column,maxColumn,row)
    if (this.layoutType != Layout.LAYOUT.TABLE) {
      this.width = currX;
      this.height = currY;
      if (this.layoutType == Layout.LAYOUT.HORIZONTAL) {
        this.height = maxItemHeight;
      } else {
        this.width = maxItemWidth;
      }
    }else{
      this.height = currY + maxItemHeight;
    }
  }

  addChild(child: DisplayObject | Component) {
    this.rootComponent.addChild(child);
    this.relayout();
  }

  addChildren(...children:DisplayObject[] | Component[]){
    children.forEach((e: Component | DisplayObject)=>{
      this.rootComponent.addChild(e);
    })
    this.relayout();
  }

  addChildAt(child: DisplayObject | Component, index: number) {
    this.rootComponent.addChildAt(child, index);
    this.relayout();
  }
  removeChild(child: DisplayObject | Component) {
    this.rootComponent.removeChild(child);
    // this.relayout();
  }
  removeChildAt(index: number) {
    this.rootComponent.removeChildAt(index);
    // this.relayout();
  }
  removeAllChild() {
    for (let i = 0; i < this.rootComponent.children.length; i++) {
      this.rootComponent.removeChild(this.rootComponent.children[i]);
      i--;
    }
    this.relayout();
  }
  destroyChildres(options?: {
    children?: boolean;
    texture?: boolean;
    baseTexture?: boolean;
  }) {
    for (let i = 0; i < this.rootComponent.children.length; i++) {
      let component = this.rootComponent.children[i];
      this.removeChild(component);
      component.destroy(options);
      i--;
    }
    this.rootComponent.children.length = 0;
  }

  getLayoutChildren():Component[]{
    return this.rootComponent.children;
  }
}
