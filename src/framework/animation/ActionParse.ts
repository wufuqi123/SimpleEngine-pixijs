import { Component } from "../core/Component";
import { Tween } from "../tween/Tween";
import { TweenManager } from "../tween/TweenManager";
import { ActionData } from "./Action";
import { Easing } from "../tween/Easing";

export class ActionParse {
  component: Component;
  constructor(component: Component) {
    this.component = component;
  }
  /**
   * 解析出  ActionData
   * @param fun 
   */
  paresFunction(fun: Function): ActionData {
    let animationData = fun();
    if (!(animationData instanceof ActionData)) {
      throw new Error(
        "当前动画解析错误，传入的Function返回值不是ActionData!"
      );
    }
    return animationData;
  }
  /**
   * 解析 Tween
   * @param animationData 
   */
  paresTween(animationData: ActionData): Tween {
    let tween = TweenManager.builder(this.component);
    tween.setExpire(true);
    tween.time(animationData.time);
    tween.easing(animationData.easingProperty||Easing.linear());
    this.paresAmin(animationData);
    this.bindAmin(animationData, tween);
    return tween;
  }
  /**
   * 初始化ActionData
   * @param animationData 
   */
  private paresAmin(animationData: ActionData) {
    switch (animationData.type) {
      case ActionData.fadeTo:
        this.paresFadeTo(animationData);
        break;
      case ActionData.fadeIn:
        this.paresFadeIn(animationData);
        break;
      case ActionData.fadeOut:
        this.paresFadeOut(animationData);
        break;
      case ActionData.moveTo:
        this.paresMoveTo(animationData);
        break;
      case ActionData.moveBy:
        this.paresMoveBy(animationData);
        break;
      case ActionData.scaleTo:
        this.paresScaleTo(animationData);
        break;
      case ActionData.scaleBy:
        this.paresScaleBy(animationData);
        break;
      case ActionData.rotateTo:
        this.paresRotateTo(animationData);
        break;
      case ActionData.rotateBy:
        this.paresRotateBy(animationData);
        break;
      case ActionData.skewTo:
        this.paresSkewTo(animationData);
        break;
      case ActionData.skewBy:
        this.paresSkewBy(animationData);
        break;
    }
  }
  /**
   * 绑定动画
   * @param animationData 
   * @param tween 
   */
  private bindAmin(animationData: ActionData, tween: Tween) {
    switch (animationData.type) {
      case ActionData.fadeTo:
      case ActionData.fadeIn:
      case ActionData.fadeOut:
        tween.to({
          opacity: animationData.opacity,
        });
        break;
      case ActionData.moveTo:
      case ActionData.moveBy:
        tween.to({
          x: animationData.x,
          y: animationData.y,
        });
        break;
      case ActionData.scaleTo:
      case ActionData.scaleBy:
        tween.to({
          scale: {
            x: animationData.scaleX,
            y: animationData.scaleY,
          },
        });
        break;
      case ActionData.rotateTo:
      case ActionData.rotateBy:
        tween.to({
          rotate: animationData.rotation,
        });
        break;
      case ActionData.skewTo:
      case ActionData.skewBy:
        tween.to({
          skew: {
            x: animationData.skewX,
            y: animationData.skewY,
          },
        });
        break;
      case ActionData.callFunc:
        if (animationData.callback != undefined) {
          tween.on("end", <any>animationData.callback);
        }
        break;
    }
  }

  /**
   * 解析FadeTo
   * @param animationData
   */
  private paresFadeTo(animationData: ActionData) {
    if (isNaN(animationData.opacity)) {
      animationData.opacity = this.component.opacity;
    }
  }
  /**
   * 解析FadeIn
   * @param animationData
   */
  private paresFadeIn(animationData: ActionData) {
    this.paresFadeTo(animationData);
  }
  /**
   * 解析FadeOut
   * @param animationData
   */
  private paresFadeOut(animationData: ActionData) {
    this.paresFadeTo(animationData);
  }

  /**
   * 解析MoveTo
   * @param animationData
   */
  private paresMoveTo(animationData: ActionData) {
    if (isNaN(animationData.x)) {
      animationData.x = this.component.x;
    }
    if (isNaN(animationData.y)) {
      animationData.y = this.component.y;
    }
  }
  /**
   * 解析MoveBy
   * @param animationData
   */
  private paresMoveBy(animationData: ActionData) {
    if (isNaN(animationData.x)) {
      animationData.x = this.component.x;
    } else {
      animationData.x += this.component.x;
    }
    if (isNaN(animationData.y)) {
      animationData.y = this.component.y;
    } else {
      animationData.y += this.component.y;
    }
  }
  /**
   * 解析ScaleTo
   * @param animationData
   */
  private paresScaleTo(animationData: ActionData) {
    if (isNaN(animationData.scaleX)) {
      animationData.scaleX = this.component.scale.x;
    }
    if (isNaN(animationData.scaleY)) {
      animationData.scaleY = this.component.scale.y;
    }
  }
  /**
   * 解析ScaleBy
   * @param animationData
   */
  private paresScaleBy(animationData: ActionData) {
    if (isNaN(animationData.scaleX)) {
      animationData.scaleX = this.component.scale.x;
    } else {
      animationData.scaleX += this.component.scale.x;
    }
    if (isNaN(animationData.scaleY)) {
      animationData.scaleY = this.component.scale.y;
    } else {
      animationData.scaleY += this.component.scale.y;
    }
  }
  /**
   * 解析RotateTo
   * @param animationData
   */
  private paresRotateTo(animationData: ActionData) {
    if (isNaN(animationData.rotation)) {
      animationData.rotation = this.component.rotate;
    }
  }
  /**
   * 解析RotateBy
   * @param animationData
   */
  private paresRotateBy(animationData: ActionData) {
    if (isNaN(animationData.rotation)) {
      animationData.rotation = this.component.rotate;
    } else {
      animationData.rotation += this.component.rotate;
    }
  }
  /**
   * 解析SkewTo
   * @param animationData
   */
  private paresSkewTo(animationData: ActionData) {
    if (isNaN(animationData.skewX)) {
      animationData.skewX = this.component.skew.x;
    }
    if (isNaN(animationData.skewY)) {
      animationData.skewY = this.component.skew.y;
    }
  }
  /**
   * 解析SkewBy
   * @param animationData
   */
  private paresSkewBy(animationData: ActionData) {
    if (isNaN(animationData.skewX)) {
      animationData.skewX = this.component.skew.x;
    } else {
      animationData.skewX += this.component.skew.x;
    }
    if (isNaN(animationData.skewY)) {
      animationData.skewY = this.component.skew.y;
    } else {
      animationData.skewY += this.component.skew.y;
    }
  }
}
