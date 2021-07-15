import { Filter, Texture } from "pixi.js";
import { ResManager } from "../core/ResManager";
import { Log } from "../log/Log";
let vertWatermark = `
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 uv0;

void main(void) {
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    uv0 = aTextureCoord;
}`;
let fragWatermark =
  `uniform sampler2D uSampler;
  uniform sampler2D noiseTexture;
  uniform vec3 iResolution;
  uniform float value;
  varying vec2 uv0;
  varying vec4 position;
  float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
  vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
  vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}
   
  float noisejj(vec3 p){
      vec3 a = floor(p);
      vec3 d = p - a;
      d = d * d * (3.0 - 2.0 * d);
   
      vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
      vec4 k1 = perm(b.xyxy);
      vec4 k2 = perm(k1.xyxy + b.zzww);
   
      vec4 c = k2 + a.zzzz;
      vec4 k3 = perm(c);
      vec4 k4 = perm(c + 1.0);
   
      vec4 o1 = fract(k3 * (1.0 / 41.0));
      vec4 o2 = fract(k4 * (1.0 / 41.0));
   
      vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
      vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);
   
      return o4.y * d.y + o4.x * (1.0 - d.y);
  }
  void main()
  {
    vec4 src_color = texture2D(uSampler, uv0);
    vec4 noise_color = texture2D(noiseTexture, uv0);
    //126,192,238
    vec4 blue = vec4(0.49,0.75,0.93,1.0);
    float n = noise_color.b;
    n = noisejj(vec3(n*value * 10.0,n*value*10.0,1));
    // if(n < 0.5){
    //   blue = vec4(1.0,1.0,1.0,1.0);
    // }
    gl_FragColor = src_color * vec4(n,n,n,1.0);
  }

`;

/**
 * 污渍  效果
 */
export class BesmirchFilter extends Filter {
  private _width: number = 0;
  private _height: number = 0;
  private _value: number = 0;
  constructor() {
    super(vertWatermark, fragWatermark,{noiseTexture:ResManager.getRes("$___noiseTexture")});
    this.value = 1;
  }
   /**
   * 宽度
   */
  set width(width: number) {
    this._width = width;
    this.updateiResolution();
  }
  get width(): number {
    return this._width;
  }
  /**
   * 高度
   */
  set height(height: number) {
    this._height = height;
    this.updateiResolution();
  }
  get height(): number {
    return this._height;
  }
  set value(value: number) {
    this._value = value;
    this.uniforms["value"] = value;
  }
  get value(): number {
    return this._value;
  }
  private updateiResolution() {
    this.uniforms["iResolution"] = new Float32Array([
      this.width,
      this.height,
      0,
    ]);
  }
  updata(dt:number){
    this.value +=0.001;
    // if(this.value>=1){
    //   this.value = 0.5;
    // }

  }
}
