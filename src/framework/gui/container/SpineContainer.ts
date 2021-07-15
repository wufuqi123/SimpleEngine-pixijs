import { spine } from "pixi.js";
export class SpineContainer extends spine.Spine {
  oneupdate!:boolean;
  update(delta:number,currCall:boolean){
    if(!this.oneupdate){
      this.oneupdate = true;
      super.update(delta/1000);
      return;
    }
    //弃用spine.js内部的update流程，启用游戏引擎的update
    if(!currCall){
      return;
    }
   super.update(delta/1000);
  }
}