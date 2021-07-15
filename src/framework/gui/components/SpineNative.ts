import { Component } from "../../core/Component";
import { EventPoint } from "../utils/EventPoint";
import { SpineContainer } from "../container/SpineContainer";
import { spine, Point, Container, utils, Sprite, Texture } from "pixi.js";
import { Log, ResManager } from "../../../framework";
import { GameApplication } from "../../../framework/core/GameApplication";
import { Canvas } from "./Canvas";
import { ColorUtils } from "../../../framework/utils/ColorUtils";
import { Image } from "./Image";
export interface TrackEntry extends spine.core.TrackEntry { }

export class SpineNative extends Component {
  rootComponent!: Component;
  pixiSpine!: spine.Spine;
  _anchor: EventPoint = new EventPoint();
  _scale: EventPoint = new EventPoint();
  isUseAnchor = true;
  _x: number = 0;
  _y: number = 0;
  solts: Component[];

  private _spineData: spine.core.SkeletonData;
  //rt
  useRT: boolean = false;
  rt?: PIXI.RenderTexture;
  rs?: PIXI.Sprite;
  rtContainer?: PIXI.Container;
  static zero: PIXI.Point = new PIXI.Point(0, 0);
  debugCanvas: Canvas;
  private _tint: number = 0xffffff;
  private isChage = {
    x: false,
    y: false,
    scaleX: false,
    scaleY: false,
  };
  ///

  constructor(spineData?: spine.core.SkeletonData, useRT: boolean = false) {
    super();
    this.rootComponent = new Component();
    this.addChild(this.rootComponent);
    this.useRT = useRT;
    this.solts = [];

    this._anchor.on("chageX", () => {
      this.x = this.x;
    });
    this._anchor.on("chageY", () => {
      this.y = this.y;
    });

    this._scale.x = 1;
    this._scale.y = 1;

    this._scale.on("chageX", () => {
      if (!this.pixiSpine) {
        this.isChage.scaleX = true;
        return;
      }
      this.isChage.scaleX = false;
      this.pixiSpine.scale.x = this.scale.x;
    });

    this._scale.on("chageY", () => {
      if (!this.pixiSpine) {
        this.isChage.scaleY = true;
        return;
      }
      this.isChage.scaleY = false;
      this.pixiSpine.scale.y = this.scale.y;
    });
    if (spineData) {
      this.spineData = spineData;
    }
  }
  set spineData(spineData: spine.core.SkeletonData) {
    if (!spineData) {
      throw new Error("spine 错误！spine没有传递！");
    }
    if (spineData == this.spineData) {
      return;
    }
    if (this.spineData) {
      this.isChage.x = true;
      this.isChage.y = true;
      this.isChage.scaleX = true;
      this.isChage.scaleY = true;
    }
    this._spineData = spineData;
    let speed = 1;
    let x = this.x;
    let y = this.y;
    let color = this.color;
    let sX = this.scale.x;
    let sY = this.scale.y;

    if (this.pixiSpine) {
      speed = this.speed;
      this.destroyChildrenTexture(this.pixiSpine);
      this.pixiSpine.destroy({children:true});
    }
    this.pixiSpine = new SpineContainer(spineData);
    // this.addChild(this.pixiSpine);
    this.pixiSpine.state.addListener({
      complete: (entry) => {
        this.emit("complete", entry);
      },
      event: (entry, event) => {
        this.emit("event", entry, event);
      },
      start: (entry) => {
        this.emit("start", entry);
      },
      end: (entry) => {
        this.emit("end", entry);
      },
      dispose: (entry) => {
        this.emit("dispose", entry);
      },
      interrupt: (entry) => {
        this.emit("interrupt", entry);
      },
    });
    if (this.isChage.x) {
      this.x = x;
    }
    if (this.isChage.y) {
      this.y = y;
    }
    if (this.isChage.scaleX) {
      this.scale.x = sX;
    }
    if (this.isChage.scaleY) {
      this.scale.y = sY;
    }
    this.speed = speed;
    this.color = color;
    this.enableRT(this.useRT);
  }
  get spineData(): spine.core.SkeletonData {
    return this._spineData;
  }
  //TODO:will flicker when false->true
  enableRT(b: boolean) {
    this.useRT = b;
    if (this.useRT) {
      if (
        this.rt == undefined &&
        this.rs == undefined &&
        this.rtContainer == undefined
      ) {
        this.rt = PIXI.RenderTexture.create({
          width: this.sceneWidth,
          height: this.sceneHeight,
        });
        this.rs = new PIXI.Sprite(this.rt);
        this.rootComponent.addChild(this.rs);
        this.rtContainer = new PIXI.Container();
        // this.rtContainer.scale.set(GameApplication.getInstance().ratio.x,GameApplication.getInstance().ratio.y)
        // this.rtContainer.y = 500;
        this.rootComponent.removeChild(this.pixiSpine);
      }
      if (this.rtContainer) {
        this.rtContainer.removeChildren();
        this.rtContainer.addChild(this.pixiSpine);
      }
    } else {
      // if (this.rt != undefined && this.rtContainer != undefined) {
      if (this.rtContainer) {
        this.rtContainer.removeChildren();
      }
      this.rootComponent.addChild(this.pixiSpine);
      this.destoryRT();
      // }
    }
  }

  destoryRT() {
    if(this.useRT){
      this.destroyChildrenTexture(this.pixiSpine);
      this.pixiSpine.destroy({children:true})
    }
    this.useRT = false;
    
    this.rt?.destroy(true);
    this.rt = undefined;
    this.rs?.destroy({children:true,texture:true,baseTexture:true});
    this.rs = undefined;
    this.rtContainer?.destroy({children:true});
    this.rtContainer = undefined;
  }
  

  update = (deltaMS: number) => {
    if (!this.active) {
      return;
    }
    this.onUpdate(deltaMS);

    if (this.rtContainer != undefined) {
      this.updateRSPos();
      window.pixiapp.renderer.render(this.rtContainer, this.rt);
      this.rtContainer.children.forEach((e: DisplayObject) => {
        e.update && e.update(deltaMS, true);
      });
    }
    //启用spine的update
    if (this.pixiSpine) {
      this.pixiSpine.update(deltaMS, true)
    }
    // this.children.forEach((element: DisplayObject) => {
    //   //启用游戏引擎的update
    //   element.update && element.update(deltaMS, true);
    // });
    this.solts.forEach((solt) => {
      if (solt.slotComponentId != this.componentId) {
        this.solts.remove(solt);
        return;
      }
      solt.update && solt.update(deltaMS, true);
    });
  };

  private updateRSPos() {

    if (this.rtContainer) {
      this.rtContainer.scale.set(this.worldScale.x, this.worldScale.y);
      this.rtContainer.x = this.worldLocation.x - this.x
      this.rtContainer.y = this.worldLocation.y - this.y;
    }
    if (this.rs != undefined) {
      this.rs.x = -this.worldLocation.x / this.worldScale.x + this.x / this.worldScale.x;
      this.rs.y = -this.worldLocation.y / this.worldScale.y + this.y / this.worldScale.y;
      this.rs.scale.set(1 / this.worldScale.x, 1 / this.worldScale.y);
    }
    // Log.info("dsjkhfdkslfj",this.x,this.y);
  }

  removeEvents() {
    super.removeEvents();
    this._anchor.off("chageX");
    this._anchor.off("chageY");
  }
  set tint(tint: number) {
    this._tint = tint;
    if (!this.pixiSpine) {
      return;
    }
    this.pixiSpine.tint = tint;
  }
  get tint(): number {
    return this._tint;
  }
  set color(color: number | string) {
    if (isNaN(color)) {
      this.tint = utils.string2hex(color);
    } else {
      this.tint = color;
    }
  }
  get color(): number | string {
    if (this._color == undefined) {
      return this.tint;
    }
    return this._color;
  }
  set width(width: number) {
    this.pixiSpine.width = width;
  }
  get width(): number {
    return this.pixiSpine.width;
  }
  set height(height: number) {
    this.pixiSpine.height = height;
  }
  get height(): number {
    return this.pixiSpine.height;
  }

  set x(x: number) {
    this._x = x;
    if (this.isUseAnchor) {
      this.rootComponent.x = x - this.anchor.x * this.width;
    } else {
      this.rootComponent.x = x;
    }
  }
  get x(): number {
    return this._x;
  }
  set y(y: number) {
    this._y = y;
    if (this.isUseAnchor) {
      this.rootComponent.y = y - this.anchor.y * this.height;
    } else {
      this.rootComponent.y = y;
    }
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

  set scale(scale: Point) {
    this._scale = <any>scale;
  }
  get scale(): Point {
    return this._scale;
  }

  /**
   * 设置速度
   * @param speed
   */
  set speed(speed: number) {
    this.pixiSpine.state.timeScale = speed;
  }
  get speed(): number {
    return this.pixiSpine.state.timeScale;
  }
  /**
   * 设置当前动画。队列中的任何的动画将被清除
   * @param trackIndex
   * @param animationName
   * @param loop
   */
  setAnimation(
    trackIndex: number,
    animationName: string,
    loop: boolean
  ): TrackEntry {
    return this.pixiSpine.state.setAnimation(trackIndex, animationName, loop);
  }

  /**
   * 设置一个空动画
   * @param trackIndex 
   * @param mixDuration 
   */
  setEmptyAnimation(trackIndex: number, mixDuration: number) {
    return this.pixiSpine.state.setEmptyAnimation(trackIndex, mixDuration);
  }

  clearTracks() {
    this.pixiSpine.state.clearTracks();
  }
  clearTrack(trackIndex: number) {
    this.pixiSpine.state.clearTrack(trackIndex);
  }

  getCurrent(trackIndex: number): TrackEntry | undefined {
    return this.pixiSpine.state.getCurrent(trackIndex);
  }
  /**
   * 添加动画
   * @param trackIndex
   * @param animationName
   * @param loop
   * @param delay
   */
  addAnimation(
    trackIndex: number,
    animationName: string,
    loop: boolean,
    delay: number
  ) {
    this.pixiSpine.state.addAnimation(trackIndex, animationName, loop, delay);
  }
  /**
   * 循环
   */
  set loop(loop: boolean) {
    this.pixiSpine.state.loop = loop;
  }
  get loop(): boolean {
    return this.pixiSpine.state.loop;
  }

  private mSlotsIndex: Array<number> = new Array();

  /**
   * 添加插槽
   * @param indexOrName
   * @param component
   */
  addSlot(indexOrName: number | string, component: Component) {
    let index;
    if (typeof indexOrName == "string") {
      index = this.pixiSpine.skeleton.findSlotIndex(indexOrName);
    } else {
      index = indexOrName;
    }

    if (isNaN(index) || index < 0) {
      throw new Error(
        "spine传入的插槽slot不正确，index或者name有误！" + indexOrName
      );
    }
    if (!component) {
      throw new Error("spine传入的插槽slot不正确，component为空！");
    }
    component.slotComponentId = this.componentId;
    component.isSlot = true;
    if (!this.solts.includes(component)) {
      this.solts.push(component);
    }
    if (!this.mSlotsIndex.includes(index)) {
      this.mSlotsIndex.push(index)
    }
    this.pixiSpine.slotContainers[index].addChild(component);
    //特殊处理：spine slot y轴相反
    component.scale.y = -1;
  }
  getSlot(indexOrName: number | string): Component | undefined {
    let index;
    if (typeof indexOrName == "string") {
      index = this.pixiSpine.skeleton.findSlotIndex(indexOrName);
    } else {
      index = indexOrName;
    }

    if (isNaN(index) || index < 0) {
      return undefined;
    }
    return this.pixiSpine.slotContainers[index];
  }

  /**
   * 获取插槽  角标
   */
  getSlotIndexs(): Array<number> {
    let arr = new Array();
    this.mSlotsIndex.forEach((v) => {
      arr.push(v);
    });
    return arr;
  }

  /**
   * 对插槽下的Sprite进行染色
   * @param indexOrName
   * @param childIdx
   * @param color string (eg.#ffffff)
   */
  setSlotSpriteColor(
    indexOrName: string | number,
    childIdx: number,
    color: string
  ) {
    let slot = this.getSlot(indexOrName);
    if (slot) {
      if(slot.children.length <= childIdx){
        throw new Error("spine 插槽进行颜色渲染时，没有  childIdx："+childIdx+" 的插槽！")
      }
      let child = slot.getChildAt(childIdx);
      if (child && child.isSprite) {
        let rgb = ColorUtils.string2rgbRadix(color);
        child.attachment.color.r = rgb[0];
        child.attachment.color.g = rgb[1];
        child.attachment.color.b = rgb[2];
      }
    }
  }

  getAllSlots(): Component[] {
    return <any>this.solts;
  }
  /**
   * 为所有关键帧设定混合及混合时间
   * @param fromName
   * @param toName
   * @param duration
   */
  setMix(fromName: string, toName: string, duration: number) {
    this.pixiSpine.stateData.setMix(fromName, toName, duration);
  }

  /**
   * 销毁全部插槽里的  渲染
   * @param indexOrNames 
   * @param options 
   */
  slotArrDestroyChildren(
    indexOrNames: Array<number | string>,
    options?: {
      children?: boolean;
      texture?: boolean;
      baseTexture?: boolean;
    }
  ) {
    indexOrNames.forEach(v => {
      this.slotDestroyChildren(v, options);
    })
  }

  /**
   * 销毁全部插槽里的  渲染
   * @param indexOrName 
   * @param options 
   */
  slotDestroyChildren(
    indexOrName: number | string,
    options?: {
      children?: boolean;
      texture?: boolean;
      baseTexture?: boolean;
    }
  ) {
    let slot = this.getSlot(indexOrName);
    if (!slot) {
      return;
    }
    let index;
    if (typeof indexOrName == "string") {
      index = this.pixiSpine.skeleton.findSlotIndex(indexOrName);
    } else {
      index = indexOrName;
    }
    this.mSlotsIndex.remove(index);
    for (let i = 0; i < slot.children.length; i++) {
      let component = slot.children[i];

      slot.removeChild(component);
      // this.children.remove(component);
      component.destroy(options);
      i--;
    }
    slot.children.length = 0;
    this.clearSlotErrorState();
  }

  /**
   * 清除  spine插槽  异常状态
   */
  clearSlotErrorState() {
    if (!this.pixiSpine || !this.pixiSpine.skeleton) { return }
    for (let j = 0; j < this.pixiSpine.skeleton.slots.length; j++) {
      let s = this.pixiSpine.skeleton.slots[j];
      for (let key in s.sprites) {
        if (s.sprites[key].isSprite && !s.sprites[key].texture) {
          s.sprites[key].texture = Texture.EMPTY;
          s.sprites[key].destroy({children:true});
          delete s.sprites[key];
        }
      }
    }
  }

  /**
   * 从webgl中  清除占用内存
   * @param parent
   */
  destroyChildrenTexture(parent: Container) {
    if (!parent) {
      return;
    }
    let children = parent.children;
    for (let i = 0; i < children.length; i++) {
      let view = children[i];
      if (!view) {
        continue;
      }
      if (view.isSprite) {
        let texture = (<Image>(<unknown>view)).texture;
        if (texture && texture.baseTexture) {
          texture.baseTexture.dispose();
        } else {
          (<Image>(<unknown>view)).texture = Texture.EMPTY;
        }
        // view.destroy();
      } else {
        this.destroyChildrenTexture(<Container>view);
      }
    }
  }
  destroy(options?: {
    children?: boolean;
    texture?: boolean;
    baseTexture?: boolean;
  }) {
    if (!options) {
      Log.warn("销毁spineNative时options无参数，请检查代码！，建议传参{children:true},否则可能会造成内存泄漏");
    }

    if (this.spineData) {
      ResManager.dispose(this.spineData.name);
    }
    this.destoryRT();
    this.destroyChildrenTexture(this);
    this.clearSlotErrorState();
    super.destroy(options);
  }
  onDestroy() {
    super.onDestroy();
    this.off("complete");
    this.off("event");
    this.off("end");
    this.off("start");
    this.off("dispose");
    this.off("interrupt");
  }

  debug() {
    this.updateRSPos();
    let b = this.pixiSpine.getBounds();
    if (!this.debugCanvas) {
      this.debugCanvas = new Canvas();
      this.debugCanvas.zIndex = 9999;
      this.addChild(this.debugCanvas);
    }
    this.debugCanvas.clear();
    this.debugCanvas.lineStyle(1, 0xffbd01, 1);
    // g.beginFill(0xFFBD01, 0.5);
    this.debugCanvas.drawRect(this._x, this._y - b.height, b.width, b.height);
    if (this.rs != undefined) {
      this.debugCanvas.drawRect(
        this.rs.x,
        this.rs.y,
        this.rs.width,
        this.rs.height
      );
    }
    this.debugCanvas.endFill();
  }
}
