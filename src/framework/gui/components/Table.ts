import { Component } from "../../core/Component";
import { EventPoint } from "../utils/EventPoint";
import { Point, DisplayObject } from "pixi.js";

export class Table extends Component {
  public rootComponent!: Component;
  protected _width: number = 0;
  protected _height: number = 0;
  private _x: number = 0;
  private _y: number = 0;
  private _column: number = 0;
  private _row: number = 0;
  private _columnGap: number = 0;
  private _rowGap: number = 0;

  draw() {
    if (this.isDestroy) return;
    if (!this.rootComponent) {
      this.rootComponent = new Component();
      super.addChild(this.rootComponent);
    }
  }

  relayout() {
    if (this.isDestroy) return;
    if (this.rootComponent.children.length == 0) return;

    let currColumn = 0;
    let currRow = 0;
    this.rootComponent.children.forEach((v,i)=>{
      let view = <Component><unknown>v;
      //行列  小于等于0  则不显示任何view
      if(this.column<=0 || this.row<=0){
        view.active = false;
        return;
      }
      currColumn = Math.floor(i%this.column)+1;
      currRow = Math.floor(i/this.column)+1;
      //当前行列  大于要显示的 行列  则不显示
      if(currColumn>this.column || currRow>this.row){
        view.active = false;
        return;
      }
      view.active = true;
      view.x = (currColumn-1) * this.columnGap;
      view.y = (currRow-1) * this.rowGap;
    });

  }

  /**
   * 最后行的  列数（因为item的宽高不一样，所布局的行数和列数也都不相同）
   */
  set column(column: number) {
    this._column = column;
  }
  get column(): number {
    return this._column;
  }
  /**
   * 最后一列的  行数（因为item的宽高不一样，所布局的行数和列数也都不相同）
   */
  set row(row: number) {
    this._row = row;
  }
  get row(): number {
    return this._row;
  }
  /**
   * 行间隔
   */
  set columnGap(gap: number) {
    this._columnGap = gap;
    this.relayout();
  }
  get columnGap(): number {
    return this._columnGap;
  }
  /**
   * 列间隔
   */
  set rowGap(gap: number) {
    this._rowGap = gap;
    this.relayout();
  }
  get rowGap(): number {
    return this._rowGap;
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
    this.rootComponent.x = x;
    this._x = x;
  }
  get x(): number {
    return this._x;
  }
  set y(y: number) {
    this.rootComponent.y = y;
    this._y = y;
  }
  get y(): number {
    return this._y;
  }

  set scale(scale: Point) {
    this.rootComponent.scale = scale;
  }
  get scale(): Point {
    return <any>this.rootComponent.scale;
  }

  addChild(child: DisplayObject | Component) {
    this.rootComponent.addChild(child);
    this.relayout();
  }
  addChildAt(child: DisplayObject | Component, index: number) {
    this.rootComponent.addChildAt(child, index);
    this.relayout();
  }
  removeChild(child: DisplayObject | Component) {
    this.rootComponent.removeChild(<any>child);
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
      component.destroy();
      i--;
    }
    this.rootComponent.children.length = 0;
  }

  getLayoutChildren(): Component[] {
    return <any>this.rootComponent.children;
  }
}
