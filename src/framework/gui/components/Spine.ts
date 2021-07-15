import { Component } from "../../core/Component";
import { EventPoint } from "../utils/EventPoint";
import { SpineContainer } from "../container/SpineContainer";
import { spine, Point, Container,utils } from "pixi.js";
import { Log, ResManager } from "../../../framework";
import { GameApplication } from "../../../framework/core/GameApplication";
import { Canvas } from "./Canvas";
export class Spine extends Component {
  pixiSpine: spine.Spine;
  _anchor: EventPoint = new EventPoint();
  isUseAnchor = true;
  _x: number = 0;
  _y: number = 0;
  solts: Component[];
  spineData: spine.core.SkeletonData;

  //rt
  useRT: boolean = false;
  rt?: PIXI.RenderTexture;
  rs?: PIXI.Sprite;
  rtContainer?: PIXI.Container;
  ///

  static zero: PIXI.Point = new PIXI.Point(0, 0);
  debugCanvas: any;

  constructor(spineData: spine.core.SkeletonData, useRT: boolean = false) {
    super();
    this.spineData = spineData;
    this.solts = [];
    this.useRT = useRT;
    this.pixiSpine = new SpineContainer(spineData);
    if (this.useRT) {
      this.rt = PIXI.RenderTexture.create({
        width: this.sceneWidth,
        height: this.sceneHeight,
      });
      this.rs = new PIXI.Sprite(this.rt);
      this.addChild(this.rs);

      this.rtContainer = new PIXI.Container();
      this.rtContainer.addChild(this.pixiSpine);
    } else {
      this.addChild(this.pixiSpine);
    }
    this._anchor.on("chageX", () => {
      this.x = this.x;
    });
    this._anchor.on("chageY", () => {
      this.y = this.y;
    });
    this.speed = 1;
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
        this.addChild(this.rs);
        this.rtContainer = new PIXI.Container();
        this.removeChild(this.pixiSpine);
        this.rtContainer.addChild(this.pixiSpine);
      }
    } else {
      if (this.rt != undefined && this.rtContainer != undefined) {
        this.rtContainer.removeChildren();
        this.addChild(this.pixiSpine);
        this.destoryRT();
      }
    }
  }

  destoryRT() {
    this.useRT = false;
    this.rtContainer?.destroy();
    this.rtContainer = undefined;
    this.rt?.destroy();
    this.rt = undefined;
    this.rs?.destroy();
    this.rs = undefined;
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
    this.children.forEach((element: DisplayObject) => {
      //启用游戏引擎的update
      element.update && element.update(deltaMS, true);
    });
    this.solts.forEach((solt) => {
      if(solt.slotComponentId != this.componentId){
        this.solts.remove(solt);
        return;
      }
      solt.update && solt.update(deltaMS, true);
    });
  };

  private updateRSPos() {
    if (this.rs != undefined) {
      let p = this.toLocal(Spine.zero);
      // console.log("rs p", p);
      this.rs.x = p?.x;
      this.rs.y = p?.y;

      let gp = this.toGlobal(Spine.zero);
      gp.x /= GameApplication.getInstance().ratio.x;
      gp.y /= GameApplication.getInstance().ratio.y;
      // console.log("rs gp", gp);
      this.pixiSpine.x = this._x + gp.x;
      this.pixiSpine.y = this._y + gp.y;
    }
  }
  removeEvents() {
    super.removeEvents();
    this._anchor.off("chageX");
    this._anchor.off("chageY");
  }
  set tint(tint: number) {
    this.pixiSpine.tint = tint;
  }
  get tint(): number {
    return this.pixiSpine.tint;
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
    if (this.isUseAnchor) {
      this.pixiSpine.x = x - (this.anchor.x - 0.5) * this.width;
    } else {
      this.pixiSpine.x = x;
    }
    this._x = x;
  }
  get x(): number {
    return this._x;
  }
  set y(y: number) {
    if (this.isUseAnchor) {
      this.pixiSpine.y = y - (this.anchor.y - 0.5) * this.height;
    } else {
      this.pixiSpine.y = y;
    }
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
  
  set scale(scale:Point){
    this.pixiSpine.scale = scale;
  }
  get scale():Point{
    return this.pixiSpine.scale;
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
  setAnimation(trackIndex: number, animationName: string, loop: boolean) {
    this.pixiSpine.state.setAnimation(trackIndex, animationName, loop);
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
  /**
   * 添加插槽
   * @param indexOrName
   * @param component
   */
  addSlot(indexOrName: number | string, component: Component) {
    let index = indexOrName;
    if (typeof indexOrName == "string") {
      index = this.pixiSpine.skeleton.findSlotIndex(indexOrName);
    }

    if (isNaN(index)) {
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
    this.pixiSpine.slotContainers[index].addChild(component);
     //特殊处理：spine slot y轴相反
     component.scale.y = -1;
  }
  getSlot(indexOrName: number | string):Component|undefined{
    let index = indexOrName;
    if (typeof indexOrName == "string") {
      index = this.pixiSpine.skeleton.findSlotIndex(indexOrName);
    }

    if (isNaN(index) || index < 0) {
      return undefined;
    }
    return this.pixiSpine.slotContainers[index];
  }

  getAllSlots():Component[]{
    return <any>this.pixiSpine.slotContainers;
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
      if (view.texture) {
        let t = view.texture;
        view.texture = null;
        t.baseTexture.dispose();
      } else {
        this.destroyChildrenTexture(view);
      }
    }
  }
  destroy(options?: {
    children?: boolean;
    texture?: boolean;
    baseTexture?: boolean;
  }) {
    if(!options){
      Log.warn("销毁spine时options无参数，请检查代码！，建议传参{children:true},否则可能会造成内存泄漏");
    }
    ResManager.dispose(this.spineData.name);
    this.destoryRT();
    this.destroyChildrenTexture(this);
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
    console.log("bounds:", b);
    if (!this.debugCanvas) {
      this.debugCanvas = new Canvas();
      this.debugCanvas.zIndex = 9999;
      this.addChild(this.debugCanvas);
    }
    this.debugCanvas.clear();
    this.debugCanvas.lineStyle(1, 0xffbd01, 1);
    // this.debugCanvas.beginFill(0xFFBD01, 0.5);
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
