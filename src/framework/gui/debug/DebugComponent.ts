import { GameApplication } from "../../core/GameApplication";
import { Component } from "../../core/Component";
import { Image } from "../components/Image";
import { Label } from "../components/Label";
import { Ticker, Texture } from "pixi.js";
// import * as GStats from "gstats/dist/main";
export class DebugComponent extends Component {
  constructor(){
    super();
    // this.interactive = false;
    this.zIndex = 10000;
  }
  _bg!: Image;
  _Label!: Label;
  // _stats: GStats.StatsJSAdapter;
  draw() {
    if (!this._bg) {
      this._bg = new Image();
      this._bg.width = 150;
      this._bg.height = 100;
      this._bg.texture = Texture.WHITE;
      this._bg.tint = 0x000000;
      this._bg.alpha = 0.5;
      this.addChild(this._bg);
      this.y = GameApplication.getInstance().designHeight - this._bg.height;
    }
    if (!this._Label) {
      this._Label = new Label();
      this._Label.text = "FPS:" + Math.floor(Ticker.shared.FPS);
      this._Label.tint = 0xffffff;
      this._Label.fontSize = 15;
      this._Label.x = 10;
      this._Label.y = 10;
      this.addChild(<any>this._Label);
    }
    // if(!this._stats){
    //   var pixiHooks = new GStats.PIXIHooks(GameApplication.getInstance());
    //   this._stats = new GStats.StatsJSAdapter(pixiHooks);
    // }
  }
  countDt=0;
  onUpdate(dt:number) {
    this.countDt+=dt;
    if(this.countDt<500){
      return;
    }
    // this._stats.update();
    // console.log(this._stats.hook)
    this.countDt = 0;
    this._Label.text = "FPS:" + Math.floor(Ticker.shared.FPS)+"\n";
    // "drawCalls:"+this._stats.hook.drawCalls+"\n"+
    // "deltaDrawCalls:"+this._stats.hook.deltaDrawCalls+"\n"+
    // "texturesCount:"+this._stats.hook.texturesCount+"\n";
  }
}
