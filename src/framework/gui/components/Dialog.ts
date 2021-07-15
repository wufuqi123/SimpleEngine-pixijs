import { Component } from "../../core/Component";
import { GameApplication } from "../../core/GameApplication";
import { Image } from "./Image";

export interface DialogEventCallback{
    cancel?(dialog:Dialog):void;
    confirm?(dialog:Dialog):void;
}

export class Dialog extends Component{
    protected bgTouch:Image;
    constructor(){
        super();
        GameApplication.getInstance().rootComponent.addChild(this);
        this.bgTouch = new Image();
        this.bgTouch.zIndex = -Math.LOG10E;
        this.addChild(this.bgTouch);
        this.bgTouch.width = this.sceneWidth;
        this.bgTouch.height = this.sceneHeight;
        this.penetrate = false;
        this.zIndex = 9999;
    }

    

    /**
     * 点击穿透
     */
    set penetrate(penetrate:boolean){
        this.bgTouch.interactive = !penetrate;   
    }
    get penetrate():boolean{
        return !this.bgTouch.interactive;
    }

    destroy(options?: {
        children?: boolean;
        texture?: boolean;
        baseTexture?: boolean;
      }){
          GameApplication.getInstance().rootComponent.removeChild(this);
        super.destroy(options);
    }
}