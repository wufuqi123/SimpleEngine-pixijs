import { List } from "./List";
import { EventManager } from "../../event/EventManager";
import { PageAdapter } from "../adapter/PageAdapter";
import { TweenManager } from "../../tween/TweenManager";
import { Tween } from "../../tween/Tween";
import { Easing } from "../../tween/Easing";
import { Timer } from "../../timer/Timer";
import { Container } from "pixi.js";
import { PagerPlugInterface } from "../plug/pager/PagerPlugInterface";
export class Pager extends List {
  public static EVENT_CHANGE = "chage";
  protected _page: number = 0;
  protected _auto: boolean = false;
  protected _loop: boolean = false;
  protected _isSetLoopCount: boolean = false;
  protected _plug:PagerPlugInterface|undefined
  constructor() {
    super();
    this.orientation = List.ORIENTATION.HORIZONTAL;
    this.inertia = false;
  }
  handleEvents() {
    this.on(EventManager.ALL_START, this.startTouch.bind(this));
    this.on(EventManager.ALL_CANCEL, this.endTouch.bind(this));
    this.on(EventManager.ALL_END, this.endTouch.bind(this));
  }
  protected startTouchX: number = 0;
  protected startTouchY: number = 0;
  protected currEndTouchPage: number = 0;
  startTouch(event: PIXI.interaction.InteractionEvent) {
    if (!this.scrollerComponent.isScroll) return;
    this.startTouchX = this.toLocal(event.data.global).x;
    this.startTouchY = this.toLocal(event.data.global).y;
  }
  endTouch(event: PIXI.interaction.InteractionEvent) {
    if (!this.scrollerComponent.isScroll) return;
    let page = this.findScrollPage();
    if (this.adapter && this.adapter.loop) {
      let offset = page - this.lastSelectLoopPage;
      // console.log(
      //   "index  page:----",
      //   page,
      //   offset,
      //   this.currEndTouchPage
      // );
      this.page = this.currEndTouchPage + offset;
    } else {
      this.page = page;
    }
    this.currEndTouchPage = this.page;
  }
  remeasure(){
    super.remeasure();
    if(!this._isSetLoopCount && this.adapter && this.width!=0&& this.height!=0){
      this._isSetLoopCount = true;
      if (this.orientation == List.ORIENTATION.HORIZONTAL) {
        if(this.contentLayout.width >=this.width*5){
          this.adapter.loopCount = 1;
        }else{
          this.adapter.loopCount = this.width*18/this.contentLayout.width;
        }
      } else if (this.orientation == List.ORIENTATION.VERTICLE) {
        if(this.contentLayout.height >=this.height*5){
          this.adapter.loopCount = 1;
        }else{
          this.adapter.loopCount = this.height*18/this.contentLayout.height;
        }
      }
      // console.log("this.adapter.loopCount:",this.adapter.loopCount,this.contentLayout.width,this.width)
    }
  }
  relayout() {
    if (!this.adapter || this.remeasureData.length == 0) return;
    super.relayout();
    let data = this.remeasureData[this.startShowIndex];
    if (this.orientation == List.ORIENTATION.HORIZONTAL) {
      this.contentLayout.x = this.width / 2 - data.width / 2;-
      this.contentLayout.y = 0;
      this.scrollerComponent.contentWidth =
        this.contentLayout.width + Math.abs(this.contentLayout.x * 2);
      this.scrollerComponent.contentHeight = this.contentLayout.height;
    } else {
      this.contentLayout.y = this.height / 2 - data.height / 2;
      this.contentLayout.x = 0;
      this.scrollerComponent.contentHeight =
        this.contentLayout.height + Math.abs(this.contentLayout.y * 2);
      this.scrollerComponent.contentWidth = this.contentLayout.width;
    }
  }
  findCurrPage(): number{
    let scrollX = Math.abs(this.scrollerComponent.scrollX);
    let scrollY = Math.abs(this.scrollerComponent.scrollY);
    let page = this.remeasureData.length;
    for (let i = 0; i < this.remeasureData.length; i++) {
      let item = this.remeasureData[i];
      // console.log("hehehe---", item.x, scrollX, item.x > scrollX);
      if (this.orientation == List.ORIENTATION.HORIZONTAL) {
        if (item.x-10 >= scrollX) {
          page = i;
          break;
        }
      } else {
        if (item.y >= scrollY) {
          page = i;
          break;
        }
      }
    }
    page -= 1;
    if (page < 0) {
      page = 0;
    }
    // console.log("hehehe---", page, scrollX);
    return page;
  }

  findScrollPage(): number {
    let scrollX = Math.abs(this.scrollerComponent.scrollX);
    let scrollY = Math.abs(this.scrollerComponent.scrollY);
    let page = this.remeasureData.length;
    for (let i = 0; i < this.remeasureData.length; i++) {
      let item = this.remeasureData[i];
      // console.log("hehehe---", item.x, scrollX, item.x > scrollX);
      if (this.orientation == List.ORIENTATION.HORIZONTAL) {
        if (item.x - item.width / 2 > scrollX) {
          page = i;
          break;
        }
      } else {
        if (item.y - item.height / 2 > scrollY) {
          page = i;
          break;
        }
      }
    }
    page -= 1;
    if (page < 0) {
      page = 0;
    }
    // console.log("hehehe---", page, scrollX);
    return page;
  }
  _onChage: Function;
  set onChage(chage: Function) {
    this._onChage = chage;
  }
  get onChage(): Function {
    return this._onChage;
  }
  /**
   * 设置页数
   */
  set page(page: number) {
    if (this.loop) {
      this.setLoopPage(page);
    } else {
      this.setPage(page);
    }
    this._page = page;
  }
  get size(): number{
    if(!this.adapter){
      return 0;
    }
    return this.adapter.getCount();
  }
  private setPage(page: number) {
    let item = this.remeasureData[page];
    if(!item){
      return;
    }
    // console.log("page:", item);
    this.scrollerComponent.scrollTween(item.x, item.y, 100, undefined, () => {
      this.onChage && this.onChage(this.page);
      this.emit(Pager.EVENT_CHANGE,this.page);
    });
  }
  protected lastLoopPage: number = 0;
  protected lastSelectLoopPage: number = NaN;
  private setLoopPage(page: number) {
    // page = -2;
    // console.log("page:-", page);
    if (page >= 0) {
      this.setPlusLoopPage(page);
      return;
    }
    this.setMinusLoopPage(page);
  }
  private setMinusLoopPage(page: number) {
    let selectPage =
    this.adapter.getSourceCount() + (page % this.adapter.getSourceCount())+this.adapter.getLoopSourceCount();
    let currAminPage = selectPage;
    if (!isNaN(this.lastSelectLoopPage)) {
      currAminPage = page - this.lastLoopPage + this.lastSelectLoopPage;
        
    }
    // console.log("page:-- hehe Plus ",page,page - this.lastLoopPage, selectPage, currAminPage);

    let item = this.remeasureData[currAminPage];
    this.scrollerComponent.scrollTween(item.x, item.y, 100, undefined, () => {
      this.selectPage(selectPage, this.reuseItemIncrement);
      this.onChage && this.onChage(this.page);
      this.emit(Pager.EVENT_CHANGE,this.page);
    });
    this.lastLoopPage = page;
    this.lastSelectLoopPage = selectPage;
  }
  private setPlusLoopPage(page: number) {
    let selectPage =
      (page % this.adapter.getSourceCount())+this.adapter.getLoopSourceCount();
    let currAminPage = selectPage;
    if (!isNaN(this.lastSelectLoopPage)) {
      currAminPage = page - this.lastLoopPage + this.lastSelectLoopPage;
    }
    // console.log("page:-- Plus ",page,page - this.lastLoopPage, selectPage, currAminPage);

    let item = this.remeasureData[currAminPage];
    this.scrollerComponent.scrollTween(item.x, item.y, 100, undefined, () => {
      this.selectPage(selectPage, this.reuseItemIncrement);
      this.onChage && this.onChage(this.page);
      this.emit(Pager.EVENT_CHANGE,this.page);
    });
    this.lastLoopPage = page;
    this.lastSelectLoopPage = selectPage;
  }
  get page(): number {
    return this._page;
  }
  set loop(loop: boolean) {
    this._loop = loop;
    this.adapter.loop = this.loop;
    this.page = this.page;
  }
  get loop(): boolean {
    return this._loop;
  }
  onDestroy(){
    super.onDestroy();
    if(this._plug){
      this._plug.destroy();
      this._plug = undefined;
    }
  }
  set plug(plug: PagerPlugInterface|undefined) {
    this._plug = plug;
    if(this._plug){
      this._plug.init(this);
    }
  }
  get plug(): PagerPlugInterface|undefined {
    return this._plug;
  }
  dataChage() {
    this.draw();
    this.page = 0;
  }
  /**
   * 设置适配器
   */
  set adapter(adapter: PageAdapter<any>) {
    if (this._adapter == adapter) {
      return;
    }
    if (this._adapter) {
      throw new Error("当前list已经有一个adapter，无法重复设置！");
    }
    adapter.pager = this;
    this._adapter = adapter;
    adapter.loop = this.loop;
    this.draw();
    this.page = 0;
  }
  get adapter(): PageAdapter<any> {
    return this._adapter;
  }

  _timer: any;
  setAuto(auto: boolean, time: number = 5000) {
    if (this._timer) {
      this._timer.clear();
    }
    if (!auto) {
      return;
    }
    this._timer = Timer.setInterval(() => {
      this.page += 1;
    }, time);
  }
}
