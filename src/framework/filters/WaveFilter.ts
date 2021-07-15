import { Filter } from "pixi.js";
import { Log } from "../log/Log";

let vertWave =  `
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 uv0;

void main(void) {
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    uv0 = aTextureCoord;
}`;
let  fragWave = 
`uniform sampler2D uSampler;
uniform vec3 iResolution;
uniform float iTime;
uniform vec2 iOffset;
varying vec2 uv0;

void main() {
    vec2 coord = uv0;
    coord.x += (sin(coord.y * 30.0 + iTime * 3.0) / 30.0 * iOffset[0]);
    coord.y += (sin(coord.x * 30.0 + iTime * 3.0) / 30.0 * iOffset[1]);
    gl_FragColor = texture2D(uSampler, coord);
}`;
/**
 * 波浪流动效果
 */
export class WaveFilter extends Filter {
  private _offsetX: number = 0.2;
  private _offsetY: number = 0.2;
  private _time: number = 0;
  constructor() {
    super(vertWave, fragWave);
    this.offsetX = 0.2;
    this.offsetY = 0.2;
    this.time = 0;
  }
  /**
   * 宽度
   */
  set offsetX(offsetX: number) {
    this._offsetX = offsetX;
    this.updateiResolution();
  }
  get offsetX(): number {
    return this._offsetX;
  }
  /**
   * 高度
   */
  set offsetY(offsetY: number) {
    this._offsetY = offsetY;
    this.updateiResolution();
  }
  get offsetY(): number {
    return this._offsetY;
  }
  private updateiResolution() {
    this.uniforms["iOffset"] = new Float32Array([
      this.offsetX,
      this.offsetY,
      0,
    ]);
  }
  /**
   * 从0开始的毫秒数
   */
  set time(time: number) {
    this._time = time;
    this.uniforms["iTime"] = time / 1000 ;
  }
  get time(): number {
    return this._time;
  }
  
  updata(delta:number){
    this.time += delta;
  }
}