import { Filter, Texture } from "pixi.js";
import { ResManager } from "../core/ResManager";
import { Log } from "../log/Log";
import { GameApplication } from "../core/GameApplication";
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
  uniform float strength;
  uniform float magnitude;
  uniform float time;
  varying vec2 uv0;
  varying vec4 position;
  void main()
  {
    // vec2 currUv = uv0 - vec2(time*2.0,time*5.0) * strength;
    vec4 noise = texture2D(noiseTexture,uv0-vec2(time,time*10.0)*strength);
    noise = ((noise*2.0)-1.0) * magnitude;
    vec4 noise_color = texture2D(uSampler, (uv0+noise.xy));
    // noise_color.g = 1.0;
    gl_FragColor =  noise_color;
  }

`;

export class WatermarkFilter extends Filter {
  private _strength: number = 0;
  private _magnitude: number = 0;
  private _time: number = 0;
  constructor() {
    super(vertWatermark, fragWatermark,{noiseTexture:ResManager.getRes("$___noiseTexture"),time:0});
    this.uniforms["noiseTexture"].baseTexture.wrapMode = PIXI.WRAP_MODES.MIRRORED_REPEAT;
    this.strength = 0.3;
    this.magnitude = 0.07;
  }
  set strength(strength: number) {
    this._strength = strength;
    this.uniforms["strength"] = strength;
  }
  get strength(): number {
    return this._strength;
  }
  set magnitude(magnitude: number) {
    this._magnitude = magnitude;
    this.uniforms["magnitude"] = magnitude;
  }
  get magnitude(): number {
    return this._magnitude;
  }
  set time(time: number) {
    this._time = time;
    this.uniforms["time"] = time;
  }
  get time(): number {
    return this._time;
  }
  updata(dt:number){
    this.time += dt / 100000;
  }
}
