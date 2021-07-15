import {filters} from "pixi.js"

/**
 * 高斯模糊
 */
export class BlurFilter extends filters.BlurFilter {
  minBlur = 0;
  maxBlur = 10;
  constructor(){
    super();
    this.blur = 0;
  }
}