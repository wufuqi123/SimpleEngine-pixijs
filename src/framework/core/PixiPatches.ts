import * as PIXI from "pixi.js";
import { EventManager } from "../event/EventManager";
const on = PIXI.Container.prototype.on;
const off = PIXI.Container.prototype.off;

function patchedOn<T extends PIXI.DisplayObject>(
  event: string,
  fn: Function
): T {
  // console.log("事件", event, this);
  switch (event) {
    case EventManager.ALL_CLICK:
      on.call(this, EventManager.TOUCH_CLICK, fn);
      return on.call(this, EventManager.MOUSE_CLICK, fn);
    case EventManager.ALL_START:
      on.call(this, EventManager.TOUCH_START, fn);
      return on.call(this, EventManager.MOUSE_DOWN, fn);
    case EventManager.ALL_MOVE:
      on.call(this, EventManager.TOUCH_MOVE, fn);
      return on.call(this, EventManager.MOUSE_MOVE, fn);
    case EventManager.ALL_END:
      on.call(this, EventManager.TOUCH_END, fn);
      return on.call(this, EventManager.MOUSE_UP, fn);
    case EventManager.ALL_CANCEL:
      on.call(this, EventManager.TOUCH_CANCEL, fn);
      return on.call(this, EventManager.MOUSE_UPOUTSIDE, fn);
  }
  return on.apply(this, arguments);
}
function patchedOff<T extends PIXI.DisplayObject>(
  event: string,
  fn?: Function
): T {
  // console.log("事件", event, this);
  switch (event) {
    case EventManager.ALL_CLICK:
      off.call(this, EventManager.TOUCH_CLICK, fn);
      return off.call(this, EventManager.MOUSE_CLICK, fn);
    case EventManager.ALL_START:
      off.call(this, EventManager.TOUCH_START, fn);
      return off.call(this, EventManager.MOUSE_DOWN, fn);
    case EventManager.ALL_MOVE:
      off.call(this, EventManager.TOUCH_MOVE, fn);
      return off.call(this, EventManager.MOUSE_MOVE, fn);
    case EventManager.ALL_END:
      off.call(this, EventManager.TOUCH_END, fn);
      return off.call(this, EventManager.MOUSE_UP, fn);
    case EventManager.ALL_CANCEL:
      off.call(this, EventManager.TOUCH_CANCEL, fn);
      return off.call(this, EventManager.MOUSE_UPOUTSIDE, fn);
  }
  return off.apply(this, arguments);
}

PIXI.Container.prototype.on = patchedOn;
PIXI.Container.prototype.off = patchedOff;
