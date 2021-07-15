import { Filter } from "pixi.js";
import { ColorUtils } from "../utils/ColorUtils";
const vertDissolve = `
        attribute vec2 aVertexPosition;
        attribute vec2 aTextureCoord;

        uniform mat3 projectionMatrix;

        varying vec2 vTextureCoord;

        void main(void) {
            gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
            vTextureCoord = aTextureCoord;
        }`;
const fragDissolve = `varying vec2 vTextureCoord;
        uniform vec3 color;
        uniform sampler2D uSampler;
        
        void main(void){
          vec4 c = texture2D(uSampler,vTextureCoord);
          c.rgb = color.rgb;
          gl_FragColor = c*c.a;
        }`;

/**
 * 颜色填充效果
 */
export class ColorFillFilter extends Filter {
  private _color!: string | number;
  constructor(color?: string | number) {
    super(vertDissolve, fragDissolve);
    if (color == undefined)
      this._color = "#000000";
    else {
      this.color = color;
    }
  }
  /**
   * 颜色
   */
  set color(color: string | number) {
    this._color = color;
    let rgb;
    if (typeof (color) == "string") {
      rgb = ColorUtils.string2rgbRadix(color);
    } else {
      rgb = ColorUtils.hex2rgbRadix(color);
    }

    this.uniforms["color"] = new Float32Array(rgb);
  }
  get color(): string | number {
    return this._color;
  }
}
