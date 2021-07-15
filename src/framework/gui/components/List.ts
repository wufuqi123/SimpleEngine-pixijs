import { Component } from "../../core/Component";
import { Scroller } from "./Scroller";
import { BaseListAdapter } from "../adapter/BaseListAdapter";
import { ObjectPool } from "../../core/ObjectPool";
import { DisplayObject } from "pixi.js";
import { AdapterContainer } from "./AdapterContainer";
import { Container, Point } from "pixi.js";
import { EventManager } from "../../event/EventManager";
import { Log } from "../../log/Log";
export class List extends Component {
  public static ORIENTATION = {
    VERTICLE: "VERTICLE",
    HORIZONTAL: "HORIZONTAL",
  };
  protected _isScroll: boolean = true;
  protected scrollerComponent!: Scroller;
  protected objactPoolMap: Map<number, ObjectPool<AdapterContainer>> = new Map();
  protected contentLayout!: AdapterContainer;
  protected _height: number = 0;
  protected _width: number = 0;
  protected _gap: number = 0;
  protected _reuseItemIncrement: number = 0;
  protected _orientation!: string;
  protected _adapter!: BaseListAdapter<any>;
  
  private findStartShowIndexTimer:Function|undefined;

  protected mTypePositionMap:Map<number,number> = new Map();

  /**
   * 开始显示的角标
   */
  startShowIndex: number = 0;
  remeasureData: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    type: number;
  }> = new Array();
  constructor() {
    super();
    this.orientation = List.ORIENTATION.VERTICLE;
  }
  onDestroy(){
    super.onDestroy();
    this.scrollerComponent.off("startTouch");
    this.scrollerComponent.off("moveTouch");
    this.scrollerComponent.off("endTouch");
  }
  /**
   * 绘制
   */
  draw() {
    if (!this.scrollerComponent) {
      this.scrollerComponent = new Scroller();
      this.inertia = true;
      this.scrollerComponent.on("startTouch",(event: PIXI.interaction.InteractionEvent)=>{
        this.emit("startTouch",event);
      });
      this.scrollerComponent.on("moveTouch",(event: PIXI.interaction.InteractionEvent)=>{
        this.emit("moveTouch",event);
      });
      this.scrollerComponent.on("endTouch",(event: PIXI.interaction.InteractionEvent)=>{
        this.emit("endTouch",event);
      });
      // this.scrollerComponent.inertia = false;
      super.addChild(this.scrollerComponent);
      this.scrollerComponent.setScrollCallback(this.onScroll.bind(this));
    }
    if (!this.contentLayout) {
      this.contentLayout = new AdapterContainer();
      this.scrollerComponent.addChild(this.contentLayout);
    }
    this.scrollerComponent.scrollType = this.orientation;
    // this.contentLayout.layoutType = this.orientation;
    this.remeasure();
    this.relayout();
  }
  // protected itemClickListener:Function|undefined;
  // setOnItemClickListener(listener:Function){
  //   this.itemClickListener = listener;
  // }
  dataChage() {
    this.draw();
  }
  get currContainerChildren(): Component[] {
    return this.contentLayout.children;
  }

  /**
   * 执行测量
   */
  remeasure() {
    if (!this.adapter) return;
    for (let i = 0; i < this.contentLayout.children.length; i++) {
      let container = this.contentLayout.children[i];
      this.reuseItemContainer(container);
      i--;
    }
    let countHeight = 0;
    let countWidth = 0;
    let itemMaxHeight = 0;
    let itemMaxWidth = 0;
    this.remeasureData.length = 0;
    for (let i = 0; i < this.adapter.getCount(); i++) {
      let objactPool = this.objactPoolMap.get(this.adapter.getItemType(i));
      if (!objactPool) {
        objactPool = new ObjectPool<AdapterContainer>();
        this.objactPoolMap.set(this.adapter.getItemType(i), objactPool);
      }

      let cWidth = 0;
      let cHeight = 0;
      let container = objactPool.get();
      let remeasure = this.adapter.getRemeasure( i,
        container);
        if(remeasure){
          container = remeasure.container;
        }
      if(remeasure && remeasure.isOpen){
        cWidth = container.width;
        cHeight = container.height;
      }else{
        container = this.adapter.getAdapterContainer(
          i,
          container,
          this.contentLayout
        );
        if(container){
          // container.measure && container.measure(this.adapter.getItem(i),i);
          cWidth = container.width;
          cHeight = container.height;
        }
      }
     
      if (i != 0) {
        if (this.orientation == List.ORIENTATION.HORIZONTAL) {
          countWidth += this.gap;
        } else {
          countHeight += this.gap;
        }
      }

      this.remeasureData.push({
        y: countHeight,
        x: countWidth,
        width: cWidth,
        height: cHeight,
        type: this.adapter.getItemType(i),
      });
      countHeight += cHeight;
      itemMaxHeight =
        itemMaxHeight < cHeight ? cHeight : itemMaxHeight;
      countWidth += cWidth;
      itemMaxWidth =
        itemMaxWidth < cWidth ? cWidth : itemMaxWidth;
      objactPool.put(container);
    }
    if (this.orientation == List.ORIENTATION.HORIZONTAL) {
      this.contentLayout.width = countWidth;
      this.contentLayout.height = itemMaxHeight;
    } else if (this.orientation == List.ORIENTATION.VERTICLE) {
      this.contentLayout.height = countHeight;
      this.contentLayout.width = itemMaxWidth;
    }
    this.scrollerComponent.contentHeight = this.contentLayout.height;
    this.scrollerComponent.contentWidth = this.contentLayout.width;
  }
  // itemClick=()=>{

  // }
  /**
   * 获取 item view
   * @param index
   */
  private getItemContainer(index: number): Container | null {
    let type =this.adapter.getItemType(index);
    let objactPool = this.objactPoolMap.get(type);
    if (!objactPool) {
      objactPool = new ObjectPool<AdapterContainer>();
      this.objactPoolMap.set(type, objactPool);
    }
    if (index < 0 || index >= this.adapter.getCount()) {
      return null;
    }
    let container = objactPool.get();
    this.mTypePositionMap.set(index,type);
    // console.log(index);
    container = this.adapter.getAdapterContainer(
      index,
      container,
      this.contentLayout
    );
    container && container._CurrIndex = index;
    // container?.off(EventManager.ALL_CLICK,this.itemClick);
    // container?.on(EventManager.ALL_CLICK,this.itemClick);
    // container && container.measure && container.measure(this.adapter.getItem(index),index);
    let data = this.remeasureData[index];
    if (this.orientation == List.ORIENTATION.HORIZONTAL) {
      container.x = data.x;
      container.y = 0;
    } else {
      container.x = 0;
      container.y = data.y;
    }
    container.showIndex = index;
    container?.zIndex = index;
    return container;
  }
  /**
   * 把item移除，并添加到  对象池里
   * @param container
   */
  reuseItemContainer(container: Container) {
    let type = this.mTypePositionMap.get(container.showIndex);
    this.contentLayout.removeChild(container);
    // let type = this.adapter.getItemType(container.showIndex);
    // Log.info("list  移除：",container.showIndex,type);
    if (type != undefined) {
      let objactPool = this.objactPoolMap.get(type);
      if (!objactPool) {
        objactPool = new ObjectPool<AdapterContainer>();
        this.objactPoolMap.set(type, objactPool);
      }
      objactPool.put(container);
    }else{
      container.destroy();
    }
  }
  /**
   * 重新布置UI，只加载一屏的UI
   */
  relayout() {
    if (!this.adapter || this.remeasureData.length == 0) return;
    for (let i = 0; i < this.contentLayout.children.length; i++) {
      let container = this.contentLayout.children[i];
      this.reuseItemContainer(container);
      i--;
    }

    let showIndex = this.startShowIndex;
    let currShowSize = 0;
    let startX = 0;
    let startY = 0;
    let size = this.height;
    if (this.orientation == List.ORIENTATION.HORIZONTAL) {
      size = this.width;
    }
    let increment = 0;
    while (currShowSize < size || increment < this.reuseItemIncrement) {
      if (currShowSize >= size) {
        increment++;
      }
      if (showIndex >= this.remeasureData.length) {
        break;
      }
      let container = this.getItemContainer(showIndex);
      if (!container) {
        return;
      }
      this.contentLayout.addChild(container);
      if (showIndex == this.startShowIndex) {
        startX = container.x;
        startY = container.y;
      }
      // console.log("list：   添加：", showIndex);

      showIndex++;
      if (this.orientation == List.ORIENTATION.HORIZONTAL) {
        currShowSize = Math.abs(startX - container.x);
      } else if (this.orientation == List.ORIENTATION.VERTICLE) {
        currShowSize = Math.abs(startY - container.y);
      }
    }
  }
  /**
   * 获取  组件  如果未显示可能获取不到
   * @param position 
   */
  getItemComponent(position: number):AdapterContainer|undefined{
    if(Array.isArray(this.contentLayout.children)){
      for(let i = 0;i<this.contentLayout.children.length;i++){
        let adapterContainer = <AdapterContainer><unknown>this.contentLayout.children[i];
        if(!adapterContainer||adapterContainer._CurrIndex!=position){
          continue;
        }
        return adapterContainer;
      }
    }
    return undefined;
  }
  /**
   * 是否可滑动
   */
  set isScroll(isScroll: boolean) {
    this._isScroll = isScroll;
  }
  get isScroll(): boolean {
    return this._isScroll;
  }
  set isVerticleScroll(isVerticleScroll: boolean) {
    this.scrollerComponent.isVerticleScroll = isVerticleScroll;
  }
  get isVerticleScroll(): boolean {
    return this.scrollerComponent.isVerticleScroll;
  }
  set isHorizontalScroll(isHorizontalScroll: boolean) {
    this.scrollerComponent.isHorizontalScroll = isHorizontalScroll;
  }
  get isHorizontalScroll(): boolean {
    return this.scrollerComponent.isHorizontalScroll;
  }

  getScrollerComponent(): Scroller{
    return this.scrollerComponent
  }

 
  /**
   * 寻找开始角标
   * @returns 
   */
   private findStartShowIndex(){
    if(this.findStartShowIndexTimer){
      return
    }
    this.scheduleOne(this.findStartShowIndexTimer = ()=>{
      this.findStartShowIndexTimer = undefined;
    },60);


    if (this.orientation == List.ORIENTATION.HORIZONTAL) {
      let scrollX = Math.abs(this.scrollerComponent.scrollX);
      for(let i = 0;i<this.remeasureData.length;i++){
        let currData = this.remeasureData[i];
        let nextData = this.remeasureData[i+1];
        if(scrollX>currData.x){
          if(!nextData){
            // console.log("dsl;jfailsdjfklsda",i)
            this.startShowIndex = i;
            return;
          }else if(nextData.x>scrollX){
            // console.log("dsl;jfailsdjfklsda",i)
            this.startShowIndex = i;
            return;
          }
        }
      }
    } else if (this.orientation == List.ORIENTATION.VERTICLE) {
      let scrollY = Math.abs(this.scrollerComponent.scrollY);
      for(let i = 0;i<this.remeasureData.length;i++){
        let currData = this.remeasureData[i];
        let nextData = this.remeasureData[i+1];
        if(scrollY>currData.y){
          if(!nextData){
            this.startShowIndex = i;
            // console.log("dsl;jfailsdjfklsda",i)
            return;
          }else if(nextData.y>scrollY){
            this.startShowIndex = i;
            // console.log("dsl;jfailsdjfklsda",i)
            return;
          }
        }
      }
    }
  }
  /**
   * 滑动回调
   * @param offsetX
   * @param offsetY
   */
  onScroll(offsetX: number, offsetY: number) {
    if(!this.isScroll) return;
    if (this.contentLayout.children.length == 0) return;
    this.findStartShowIndex();
    this.emit("scroll", offsetX, offsetY);
    if (this.orientation == List.ORIENTATION.HORIZONTAL) {
      this.horizontalScroll(offsetX);
    } else if (this.orientation == List.ORIENTATION.VERTICLE) {
      this.verticleScroll(offsetY);
    }
  }
  /**
   * 水平滑动  执行复用
   * @param offsetX
   */
  horizontalScroll(offsetX: number) {
    if (offsetX < 0) {
      // 向左滑动
      //添加复用
      let currRightPosition = this.width - this.scrollerComponent.scrollX;
      let rigthIndex = 0;
      if (
        this.contentLayout.children.length - 1 - this.reuseItemIncrement >
        0
      ) {
        rigthIndex =
          this.contentLayout.children.length - 1 - this.reuseItemIncrement;
      }
      let currRightContainer = this.contentLayout.children[rigthIndex];
      if (
        currRightContainer &&
        Math.abs(currRightPosition) > Math.abs(currRightContainer.x)
      ) {
        let currRightIndex =
          this.contentLayout.children[this.contentLayout.children.length - 1]
            .showIndex + 1;
        if (
          !this.hasComponentZindex(currRightIndex) &&
          currRightIndex < this.remeasureData.length
        ) {
          let container = this.getItemContainer(currRightIndex);
          if (container) {
            this.contentLayout.addChildAt(
              container,
              this.contentLayout.children.length
            );

            // console.log("list：   添加：", currRightIndex);
          }
          // console.log("向左滑动  添加", currRightIndex);
        }
      }
      // //删除复用
      let currLeftPosition = this.scrollerComponent.scrollX;
      let reuseItemIncrement = this.reuseItemIncrement - 1;
      if (reuseItemIncrement < 0) {
        reuseItemIncrement = 0;
      }
      let currLeftContainer = this.contentLayout.children[reuseItemIncrement];
      if (
        currLeftContainer &&
        currLeftContainer.width + currLeftContainer.x <=
          Math.abs(currLeftPosition)
      ) {
        currLeftContainer = this.contentLayout.children[0];
        // console.log("list：   删除：", currLeftContainer.showIndex);
        this.reuseItemContainer(currLeftContainer);
        // console.log("向左滑动   删除", currLeftContainer.showIndex);
      }
      // console.log("向左滑动")
    } else {
      //添加
      let currLeftPosition = this.scrollerComponent.scrollX;
      let reuseItemIncrement = this.reuseItemIncrement - 1;
      if (reuseItemIncrement < 0) {
        reuseItemIncrement = 0;
      }
      let currLeftContainer = this.contentLayout.children[reuseItemIncrement];
      if (
        currLeftContainer &&
        Math.abs(currLeftPosition) < Math.abs(currLeftContainer.x)
      ) {
        let currLeftIndex = this.contentLayout.children[0].showIndex - 1;
        if (!this.hasComponentZindex(currLeftIndex) && currLeftIndex != -1) {
          let container = this.getItemContainer(currLeftIndex);
          if (container) {
            this.contentLayout.addChildAt(container, 0);
            // console.log("list：   添加：", currLeftIndex);
          }
        }
        // console.log("向右滑动   添加", currLeftIndex);
      }
      //删除
      let currRightPosition = this.width - this.scrollerComponent.scrollX;
      let rigthIndex = 0;
      if (
        this.contentLayout.children.length - 1 - this.reuseItemIncrement >
        0
      ) {
        rigthIndex =
          this.contentLayout.children.length - 1 - this.reuseItemIncrement;
      }
      let currRightContainer = this.contentLayout.children[rigthIndex];
      if (
        currRightContainer &&
        currRightContainer.width + currRightPosition <
          Math.abs(currRightContainer.x)
      ) {
        currRightContainer = this.contentLayout.children[
          this.contentLayout.children.length - 1
        ];
        // console.log("list：   删除：", currRightContainer.showIndex);
        this.reuseItemContainer(currRightContainer);
        // console.log("向右滑动  删除", currRightContainer.showIndex);
      }
      // console.log("向右滑动");
    }
  }
  hasComponentZindex(zIndex: number): boolean {
    for (let i = 0; i < this.contentLayout.children.length; i++) {
      if (this.contentLayout.children[i].zIndex == zIndex) {
        return true;
      }
    }
    return false;
  }
  /**
   * 垂直滑动 执行复用
   * @param offsetY
   */
  verticleScroll(offsetY: number) {
    
    if (offsetY < 0) {
      // 向上滑动
      //添加复用
      let currBottomPosition = this.height - this.scrollerComponent.scrollY;

      let bottomIndex =
        this.contentLayout.children.length - 1 - this.reuseItemIncrement;

      let currBottomContainer = this.contentLayout.children[bottomIndex];
      if (
        currBottomContainer &&
        Math.abs(currBottomPosition) > Math.abs(currBottomContainer.y)
      ) {
        let currBottomIndex =
          this.contentLayout.children[this.contentLayout.children.length - 1]
            .showIndex + 1;
        if (
          !this.hasComponentZindex(currBottomIndex) &&
          currBottomIndex < this.remeasureData.length
        ) {
          let container = this.getItemContainer(currBottomIndex);
          if (container) {
            this.contentLayout.addChildAt(
              container,
              this.contentLayout.children.length
            );
            // console.log("list：上   添加：", currBottomIndex);
          }
          // console.log("向上滑动  添加", currBottomIndex);
        }
      }
      //删除复用
      let currTopPosition = this.scrollerComponent.scrollY;
      let reuseItemIncrement = this.reuseItemIncrement - 1;
      if (reuseItemIncrement < 0) {
        reuseItemIncrement = 0;
      }
      let currTopContainer = this.contentLayout.children[reuseItemIncrement];
      if (
        currTopContainer &&
        -currTopContainer.height - currTopPosition >
          Math.abs(currTopContainer.y)
      ) {
        currTopContainer = this.contentLayout.children[0];
        // console.log("list：上   删除：", currTopContainer.showIndex);
        this.reuseItemContainer(currTopContainer);
        // console.log("向上滑动   删除", currTopContainer.showIndex);
      }
    } else {
      //添加
      let currTopPosition = this.scrollerComponent.scrollY;
      let reuseItemIncrement = this.reuseItemIncrement - 1;
      if (reuseItemIncrement < 0) {
        reuseItemIncrement = 0;
      }
      let currTopContainer = this.contentLayout.children[reuseItemIncrement];
      if(!currTopContainer){
        currTopContainer = this.contentLayout.children[this.contentLayout.children.length - 1];
      }
      // console.log("list：下   添加：",this.reuseItemIncrement, Math.abs(currTopContainer.y),Math.abs(currTopPosition));
      if (
        currTopContainer &&
        Math.abs(currTopPosition) < Math.abs(currTopContainer.y)
      ) {
        let currTopIndex = this.contentLayout.children[0].showIndex - 1;
        if (!this.hasComponentZindex(currTopIndex) && currTopIndex != -1) {
          let container = this.getItemContainer(currTopIndex);
          if (container) {
            this.contentLayout.addChildAt(container, 0);
            // console.log("list：下   添加：", currTopIndex);
          }
        }
        // console.log("向下滑动   添加", currTopIndex);
      }
      //删除
      let currBottomPosition = this.height - this.scrollerComponent.scrollY;
      let bottomIndex = 0;
      if (
        this.contentLayout.children.length - 1 - this.reuseItemIncrement >
        0
      ) {
        bottomIndex =
          this.contentLayout.children.length - 1 - this.reuseItemIncrement;
      }
      let currBottomContainer = this.contentLayout.children[bottomIndex];
      if (
        currBottomContainer &&
        currBottomContainer.height + currBottomPosition <
          Math.abs(currBottomContainer.y)
      ) {
        currBottomContainer = this.contentLayout.children[
          this.contentLayout.children.length - 1
        ];
        // console.log("list：下   删除：", currBottomContainer.showIndex);
        this.reuseItemContainer(currBottomContainer);
        // console.log("向下滑动  删除", currBottomContainer.showIndex);
      }
    }
  }
  /**
   * 滑动惯性
   */
  set inertia(inertia: boolean) {
    this.scrollerComponent.inertia = inertia;
  }
  get inertia(): boolean {
    return this.scrollerComponent.inertia;
  }
  /**
   * 间隔
   */
  set gap(gap: number) {
    this._gap = gap;
    this.draw();
  }
  get gap(): number {
    return this._gap;
  }
  
  set height(height: number) {
    this._height = height;
    this.scrollerComponent.height = height;
    this.relayout();
  }
  get height(): number {
    return this._height;
  }

  get contentHeight(): number{
    return this.contentLayout.height;
  }
  set width(width: number) {
    this._width = width;
    this.scrollerComponent.width = width;
    this.relayout();
  }
  get width(): number {
    return this._width;
  }
  get contentWidth(): number{
    return this.contentLayout.width;
  }
  /**
   * 复用的增量，除了要复用一屏的个数，再增加多少个数
   * 如果快速滑动UI出现断层，可以考虑使用此参数
   * lits.reuseItemIncrement = 10;  效果：除了创建一屏的item，还会多创建10个item
   */
  set reuseItemIncrement(increment: number) {
    this._reuseItemIncrement = increment;
    this.relayout();
  }
  get reuseItemIncrement(): number {
    return this._reuseItemIncrement;
  }

  /**
   * 获取最底部中的第一行的item的位置
   * @returns 
   */
  getBottomItemTopPade():number{
    for(let i = this.remeasureData.length-1;i>=0;i--){
      let data = this.remeasureData[i];
      if (this.orientation == List.ORIENTATION.HORIZONTAL) {
        if(Math.abs(data.x)<=this.scrollerComponent.contentWidth- this.width){
          return i;
        }
      }else{
        if(Math.abs(data.y)<=this.scrollerComponent.contentHeight - this.height){
          return i;
        }
      }
    }

    return 0;
  }

  /**
   * 直接加载到指定条目，无动画
   * @param page
   */
  selectPage(page: number, offset: number = 0) {
    if (!this.adapter || this.remeasureData.length == 0) {
      return;
    }
    this.startShowIndex = page - offset;

    let bottomPage = this.getBottomItemTopPade();

    console.log("jksaahdjkasdhkas",bottomPage,this.startShowIndex)
    if( this.startShowIndex>bottomPage){
      this.startShowIndex=bottomPage;
      page = this.startShowIndex + offset;
    }
    if (this.startShowIndex < 0) {
      this.startShowIndex = 0;
    }
    if(page<0){
      page = 0;
    }
    if(this.startShowIndex>=this.adapter.data.length){
      this.startShowIndex = this.adapter.data.length - 1;
      page = this.startShowIndex;
      offset = 0;
    }
    if (this.orientation == List.ORIENTATION.HORIZONTAL) {
      this.scrollerComponent.scrollX = -this.remeasureData[page].x;
    } else {
      this.scrollerComponent.scrollY = -this.remeasureData[page].y;
    }
    this.relayout();
  }

  /**
   * 滑动到底部
   * @param showViewNumber 
   */
  selectBottom(showViewNumber:number = 10){
    let len = this.adapter.data.length-showViewNumber;
    if(len<0){
      len = 0;
    }
    this.selectPage(len);
    this.reuseItemIncrement = showViewNumber;
    if (this.orientation == List.ORIENTATION.HORIZONTAL) {
      let scrollX = -(this.scrollerComponent.contentWidth - this.width);
      if(scrollX>0){
        scrollX = 0;
      }
      this.scrollerComponent.scrollX = scrollX;
    }else{
      let scrollY = -(this.scrollerComponent.contentHeight - this.height);
      if(scrollY>0){
        scrollY = 0;
      }
      this.scrollerComponent.scrollY = scrollY;
    }
  }

  /**
   * 设置方向
   */
  set orientation(orientation: string) {
    this._orientation = orientation;
    this.draw();
  }
  get orientation(): string {
    return this._orientation;
  }

  /**
   * 设置适配器
   */
  set adapter(adapter: BaseListAdapter<any>) {
    if (this._adapter == adapter) {
      return;
    }
    if (this._adapter) {
      throw new Error("当前list已经有一个adapter，无法重复设置！");
    }
    adapter.list = this;
    this._adapter = adapter;
    this.draw();
  }
  get adapter(): BaseListAdapter<any> {
    return this._adapter;
  }

  private addChild(child: DisplayObject) {
    this.contentLayout.addChild(child);
  }
  private addChildAt(child: DisplayObject, index: number) {
    this.contentLayout.addChildAt(child, index);
  }
  private removeChild(child: DisplayObject) {
    this.contentLayout.removeChild(child);
  }
  private removeChildAt(index: number) {
    this.contentLayout.removeChildAt(index);
  }

  set anchor(anchor: Point) {
    this.scrollerComponent.anchor = anchor;
  }
  get anchor(): Point {
    return this.scrollerComponent.anchor;
  }
  destroy(options: {
    children?: boolean;
    texture?: boolean;
    baseTexture?: boolean;
  }){
    this.objactPoolMap.forEach(v=>{
      let label;
      while ((label = v.get())) {
        label.destroy(options);
      }
    })
    this.objactPoolMap.clear();
    super.destroy();
  }
}
