import { Image } from "./Image";
import { NineSlicePlane,Texture } from "pixi.js";
import {EventPoint} from "../utils/EventPoint"
/**
 *      A                          B
   +---+----------------------+---+
 C | 1 |          2           | 3 |
   +---+----------------------+---+
   |   |                      |   |
   | 4 |          5           | 6 |
   |   |                      |   |
   +---+----------------------+---+
 D | 7 |          8           | 9 |
   +---+----------------------+---+
当改变这个对象的宽度和/或高度:
第1区、第3区、第7区和第9区将保持不变。
第2区和第8区将被水平拉伸
第4和第6区域将垂直拉伸
区域5将被水平和垂直拉伸
 * 
 * 
 */
export class PlaneImage extends Image {
  private rootSprite: NineSlicePlane;
  private _leftWidth:number = 0;
  private _topHeight:number = 0;
  private _rightWidth:number = 0;
  private _bottomHeight:number = 0;
  protected _anchor: EventPoint;
  protected _x:number = 0;
  protected _y:number = 0;
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
  }
  draw() {
    if(!this._anchor){
      this._anchor = new EventPoint();
    }
    if (!this.rootSprite) {
      this.rootSprite = new NineSlicePlane(Texture.WHITE,0,0,0,0);
      this.addChild(this.rootSprite);
    }
  }
  /**
   * 左竖线的大小（A）
   */
  set leftWidth(leftWidth:number){
    this._leftWidth = leftWidth;
    this.rootSprite.leftWidth = leftWidth;
  }
  get leftWidth():number{
    return this._leftWidth;
  }
  /**
   * 顶部单杠的大小（C）
   */
  set topHeight(topHeight:number){
    this._topHeight = topHeight;
    this.rootSprite.topHeight = topHeight;
  }
  get topHeight():number{
    return this._topHeight;
  }
  /**
   * 右竖线的大小（B）
   */
  set rightWidth(rightWidth:number){
    this._rightWidth = rightWidth;
    this.rootSprite.rightWidth = rightWidth;
  }
  get rightWidth():number{
    return this._rightWidth;
  }
  /**
   * 底部单杠的大小（D）
   */
  set bottomHeight(bottomHeight:number){
    this._bottomHeight = bottomHeight;
    this.rootSprite.bottomHeight = bottomHeight;
  }
  get bottomHeight():number{
    return this._bottomHeight;
  }

  set width(width:number){
    this.rootSprite.width = width;
    this.x = this.x;
    this.emit("chageSize");
  }
  get width():number{
    return this.rootSprite.width;
  }
  set height(height:number){
    this.rootSprite.height = height;
    this.y = this.y;
    this.emit("chageSize");
  }
  get height():number{
    return this.rootSprite.height;
  }

  set x(x: number) {
    this.rootSprite.x = x - this.anchor.x * this.width;
    this._x = x;
  }
  get x(): number {
    return this._x;
  }
  set y(y: number) {
    this.rootSprite.y = y - this.anchor.y * this.height;
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
}