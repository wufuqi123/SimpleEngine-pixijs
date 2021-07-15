import { Component } from "../core/Component";
import { Log } from "../log/Log";
import { Tween } from "../tween/Tween";
import { ActionData } from "./Action";
import { ActionParse } from "./ActionParse";
import { EventEmitter } from "eventemitter3";
/**
 * 动画集合
 */
export class ActionSet extends EventEmitter{
  mComponent: Component;
  mStartActionData:ActionData;
  mAnimationParse:ActionParse;
  mIsStart:boolean = false;
  mRunTweenArray:Array<Tween> = new Array();
  constructor(component: Component,fun:Function) {
    super();
    this.mComponent = component;
    this.mAnimationParse = new ActionParse(component);
    this.mStartActionData = this.mAnimationParse.paresFunction(fun);
  }

  /**
   * 执行动画
   */
  start(){
    if(this.mIsStart){
      Log.warn("当前动画集合正在运行中");
      return;
    }
    this.mIsStart = true;
    this.emit("start");
    this.runTween(this.mStartActionData);
  }
  /**
   * 停止动画
   */
  stop(){
    for(let i = 0 ;i<this.mRunTweenArray.length;i++){
      let tween = this.mRunTweenArray[i];
      tween.stop().remove();
    }
    // Log.log("停止动画");
    this.mIsStart = false;
    this.mRunTweenArray.length = 0;
  }

  private runTween(animationData:ActionData,callback?:Function){
    if(!this.mIsStart){true}
    if(animationData.type == ActionData.spawn){
      this.runSpawn(animationData,callback)
    }else if(animationData.type == ActionData.sequence){
      let animationDataArray = animationData.animationDataArray;
      if(!Array.isArray(animationDataArray) || animationDataArray.length <= 0){
        callback && callback();
        return;
      }
      this.runSequence(animationDataArray,0,callback);
    }else if(animationData.type == ActionData.callFunc){
      animationData.callback && animationData.callback();
      callback && callback();
      this.tweenEnd();
    }else {
      let tween = this.mAnimationParse.paresTween(animationData);
      // tween.on("update",()=>{
      //   Log.info("当前：",this.mComponent.x)
      // })
      tween.on("end",()=>{
        callback && callback();
        this.tweenEnd(tween,animationData);
      });
      this.mRunTweenArray.push(tween);
      tween.start();
    }
    
  }
  private runSpawn(animationData:ActionData,callback?:Function){
    let animationDataArray = animationData.animationDataArray;
    if(!Array.isArray(animationDataArray)){
      callback && callback();
      return;
    }
    let index = 0;
    for(let i = 0; i < animationDataArray.length; i++){
      this.runTween(this.mAnimationParse.paresFunction(animationDataArray[i]),()=>{
        index++;
        // Log.debug(index,animationDataArray.length,"heheheheh")
        if(animationDataArray && index >= animationDataArray.length){
          callback && callback();
        }
      });
    }
  }
  private runSequence(animationDataArray:Function[],index:number,callback?:Function){
    let animationData = this.mAnimationParse.paresFunction(animationDataArray[index]);
    this.runTween(animationData,()=>{
      index++;
      // Log.debug(index,animationDataArray.length,"hehehehllllleh");
      if(index >= animationDataArray.length){
        callback && callback();
        return;
      }
      this.runSequence(animationDataArray,index,callback);
      
    })
  }

  private tweenEnd(tween?:Tween,animationData?:ActionData){
    if(animationData){
      let animationDataArray = animationData.animationDataArray;
      if(Array.isArray(animationDataArray) && animationDataArray.length > 0){
        this.runTween(this.mAnimationParse.paresFunction(animationDataArray[0]));
      }
    }
    if(tween){
      this.mRunTweenArray.remove(tween);
      tween.off("end");
    }
    if(this.mRunTweenArray.length == 0){
      this.mIsStart = false;
      this.emit("end");
    }
  }
}