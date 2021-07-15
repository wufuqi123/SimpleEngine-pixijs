export class Action {
  /**
   * 透明度渐变到指定值
   * @param time
   * @param opacity
   */
  public static fadeTo(time: number, opacity: number,easing?:Function): Function {
    return (): ActionData => {
      let animationData = new ActionData();
      animationData.type = ActionData.fadeTo;
      animationData.time = time;
      animationData.opacity = opacity;
      if (easing != undefined) {
        animationData.easingProperty = easing;
      }
      return animationData;
    };
  }
  /**
   * 透明度渐入
   * @param time
   */
  public static fadeIn(time: number,easing?:Function): Function {
    return (): ActionData => {
      let animationData = new ActionData();
      animationData.type = ActionData.fadeIn;
      animationData.time = time;
      animationData.opacity = 255;
      if (easing != undefined) {
        animationData.easingProperty = easing;
      }
      return animationData;
    };
  }
  /**
   * 透明度渐出
   * @param time
   */
  public static fadeOut(time: number,easing?:Function): Function {
    return (): ActionData => {
      let animationData = new ActionData();
      animationData.type = ActionData.fadeOut;
      animationData.time = time;
      animationData.opacity = 0;
      if (easing != undefined) {
        animationData.easingProperty = easing;
      }
      return animationData;
    };
  }
  /**
   * 移动到目标位置
   * @param time
   * @param x
   * @param y
   */
  public static moveTo(time: number, x?: number, y?: number,easing?:Function): Function {
    return (): ActionData => {
      let animationData = new ActionData();
      animationData.type = ActionData.moveTo;
      animationData.time = time;
      if (x != undefined) {
        animationData.x = x;
      }
      if (y != undefined) {
        animationData.y = y;
      }
      if (easing != undefined) {
        animationData.easingProperty = easing;
      }
      return animationData;
    };
  }
  /**
   * 移动到指定位置
   * @param time
   * @param x
   * @param y
   */
  public static moveBy(time: number, x?: number, y?: number,easing?:Function): Function {
    return (): ActionData => {
      let animationData = new ActionData();
      animationData.type = ActionData.moveBy;
      animationData.time = time;
      if (x != undefined) {
        animationData.x = x;
      }
      if (y != undefined) {
        animationData.y = y;
      }
      if (easing != undefined) {
        animationData.easingProperty = easing;
      }
      return animationData;
    };
  }
  /**
   * 移动到目标位置
   * @param time
   * @param x
   * @param y
   */
  public static scaleTo(time: number, x?: number, y?: number,easing?:Function): Function {
    return (): ActionData => {
      let animationData = new ActionData();
      animationData.type = ActionData.scaleTo;
      animationData.time = time;
      if (x != undefined) {
        animationData.scaleX = x;
      }
      if (y != undefined) {
        animationData.scaleY = y;
      }
      if (easing != undefined) {
        animationData.easingProperty = easing;
      }
      return animationData;
    };
  }
  /**
   * 移动到指定位置
   * @param time
   * @param x
   * @param y
   */
  public static scaleBy(time: number, x?: number, y?: number,easing?:Function): Function {
    return (): ActionData => {
      let animationData = new ActionData();
      animationData.type = ActionData.scaleBy;
      animationData.time = time;
      if (x != undefined) {
        animationData.scaleX = x;
      }
      if (y != undefined) {
        animationData.scaleY = y;
      }
      if (easing != undefined) {
        animationData.easingProperty = easing;
      }
      return animationData;
    };
  }
  /**
   * 旋转到目标角度
   * @param time
   * @param rotation
   */
  public static rotateTo(time: number, rotation: number,easing?:Function): Function {
    return (): ActionData => {
      let animationData = new ActionData();
      animationData.type = ActionData.rotateTo;
      animationData.time = time;
      animationData.rotation = rotation;
      if (easing != undefined) {
        animationData.easingProperty = easing;
      }
      return animationData;
    };
  }
  /**
   * 旋转到目标角度
   * @param time
   * @param rotation
   */
  public static rotateBy(time: number, rotation: number,easing?:Function): Function {
    return (): ActionData => {
      let animationData = new ActionData();
      animationData.type = ActionData.rotateBy;
      animationData.time = time;
      animationData.rotation = rotation;
      if (easing != undefined) {
        animationData.easingProperty = easing;
      }
      return animationData;
    };
  }

  /**
   * 倾斜到目标位置
   * @param time
   * @param x
   * @param y
   */
  public static skewTo(time: number, x?: number, y?: number,easing?:Function): Function {
    return (): ActionData => {
      let animationData = new ActionData();
      animationData.type = ActionData.skewTo;
      animationData.time = time;
      if (x != undefined) {
        animationData.skewX = x;
      }
      if (y != undefined) {
        animationData.skewY = y;
      }
      if (easing != undefined) {
        animationData.easingProperty = easing;
      }
      return animationData;
    };
  }
  /**
   * 倾斜到指定位置
   * @param time
   * @param x
   * @param y
   */
  public static skewBy(time: number, x?: number, y?: number,easing?:Function): Function {
    return (): ActionData => {
      let animationData = new ActionData();
      animationData.type = ActionData.skewBy;
      animationData.time = time;
      if (x != undefined) {
        animationData.skewX = x;
      }
      if (y != undefined) {
        animationData.skewY = y;
      }
      if (easing != undefined) {
        animationData.easingProperty = easing;
      }
      return animationData;
    };
  }
  /**
   * 回调
   * @param callback
   */
  public static callFunc(callback?: Function): Function {
    return (): ActionData => {
      let animationData = new ActionData();
      animationData.type = ActionData.callFunc;
      animationData.callback = callback;
      return animationData;
    };
  }
  /**
   * 同步动画
   * @param adArr
   */
  public static spawn(...adArr: Function[]): Function {
    return (): ActionData => {
      let animationData = new ActionData();
      animationData.type = ActionData.spawn;
      animationData.animationDataArray = adArr;
      return animationData;
    };
  }
  /**
   * 顺序动画
   * @param adArr
   */
  public static sequence(...adArr: Function[]): Function {
    return (): ActionData => {
      let animationData = new ActionData();
      animationData.type = ActionData.sequence;
      animationData.animationDataArray = adArr;
      return animationData;
    };
  }

    /**
   * 等待时间
   * @param time
   */
  public static wait(time: number): Function {
    return (): ActionData => {
      let animationData = new ActionData();
      animationData.time = time;
      return animationData;
    };
  }
}

export class ActionData {
  public static fadeTo = "fadeTo";
  public static fadeIn = "fadeIn";
  public static fadeOut = "fadeOut";
  public static moveTo = "moveTo";
  public static moveBy = "moveBy";
  public static scaleTo = "scaleTo";
  public static scaleBy = "scaleBy";
  public static rotateTo = "rotateTo";
  public static rotateBy = "rotateBy";
  public static skewTo = "skewTo";
  public static skewBy = "skewBy";
  public static callFunc = "callFunc";
  public static spawn = "spawn";
  public static sequence = "sequence";
  type: string | undefined;
  opacity: number = NaN;
  time: number = 0;
  y: number = NaN;
  x: number = NaN;
  rotation: number = NaN;
  scaleX: number = NaN;
  scaleY: number = NaN;
  skewX: number = NaN;
  skewY: number = NaN;
  easingProperty: Function|undefined;
  tween:Function|undefined;
  callback: Function | undefined;
  animationDataArray: Array<Function> | undefined;
}
