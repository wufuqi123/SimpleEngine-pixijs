import { FontLoader } from "./FontLoader";
import { ResManager } from "../core/ResManager";
import * as PIXI from "pixi.js";
export class FontManager {
  public static fontDiv: HTMLElement;
  public static init() {
    if(PIXI.BitmapFontLoader){
      //  去掉pixijs的BitmapFontLoader报错
      if(Array.isArray((<any>ResManager.resLoader)._afterMiddleware)){
        (<any>ResManager.resLoader)._afterMiddleware.remove(PIXI.BitmapFontLoader.use);
      }
    }
    let div = document.createElement('div');
    div.style.height = "0px";
    div.style.overflow = "hidden";
    document.body.appendChild(div);
    FontManager.fontDiv = div;
    ResManager.resLoader.use(FontLoader.use);
  }
}