import * as PIXI from "pixi.js";
import { GameApplication } from "../core/GameApplication";
import { Component } from "../core/Component";
import { Base64Utlis } from "./Base64Utlis";

export class ScreenShotUtils {
  public static ScreenShotBase64(
    target: PIXI.DisplayObject | PIXI.RenderTexture | Component
  ): string {
    return GameApplication.getInstance().application.renderer.extract.base64(
      target,
      "image/jpeg"
    );
  }

  public static ScreenShotImage(
    target: PIXI.DisplayObject | PIXI.RenderTexture | Component
  ): HTMLImageElement {
    return GameApplication.getInstance().application.renderer.extract.image(
      target,
      "image/jpeg"
    );
  }

  public static downloadImg(
    target: PIXI.DisplayObject | PIXI.RenderTexture | Component
  ) {
    let str = ScreenShotUtils.ScreenShotBase64(target);
    let blob = Base64Utlis.base64ToBlob(str); //new Blob([content]);
    let aLink = document.createElement("img");
    aLink.setAttribute("href", URL.createObjectURL(blob));
    aLink.setAttribute("download", Date.now() + "");
    let e = document.createEvent("MouseEvents");
    e.initMouseEvent(
      "click",
      false,
      true,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null
    );
    aLink.dispatchEvent(e);
  }

  public static weChatSaveImage(
    target: PIXI.DisplayObject | PIXI.RenderTexture | Component
  ): HTMLImageElement {
    let str = ScreenShotUtils.ScreenShotBase64(target);
    let blob = Base64Utlis.base64ToBlob(str); //new Blob([content]);
    let oImg = document.createElement("img");
    oImg.id = "oImg";
    oImg.className = "o-img";
    oImg.src = URL.createObjectURL(blob); //imgUrl是html2canvas返回的截图的base64码
    document.body.appendChild(oImg); //将生成的截图放到页面中
    return oImg;
  }

  /**
   * 获取压缩图片
   * @param target
   * @param quality
   */
  public static compressImage(
    target: PIXI.DisplayObject | PIXI.RenderTexture | Component,
    quality = 1
  ): HTMLImageElement {
    let img = document.createElement("img");
    img.src = this.toDataURL(target, quality);
    return img;
  }
  /**
   * 获取压缩图片
   * @param target
   * @param quality
   */
  public static toDataURL(
    target: PIXI.DisplayObject | PIXI.RenderTexture | Component,
    quality = 1
  ): string {
    let canvas = GameApplication.getInstance().application.renderer.extract.canvas(
      target
    );
    return canvas.toDataURL("image/jpeg", quality);
  }
}
