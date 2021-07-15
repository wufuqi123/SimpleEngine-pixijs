import { Filter } from "pixi.js";
const vertFlicker = `
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 uv0;

void main(void) {
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    uv0 = aTextureCoord;
}`;
const fragFlicker = `uniform sampler2D uSampler;
uniform vec4 tintColor;
uniform vec3 backColor;

varying vec4 v_fragmentColor;
varying vec2 uv0;
void main()
{
    vec4 c = texture2D(uSampler, uv0);
    gl_FragColor.rgb = c.rgb * tintColor.rgb + backColor * c.a;
    gl_FragColor.a = c.a;
}`;
/**
 * 闪烁
 */
export class FlickerFilter extends Filter {
  private _tintColor!: Float32Array;
  private _backColor!: Float32Array;
  private _flash:number = 0;
  private _gray:number = 1;
  constructor() {
    super(vertFlicker, fragFlicker);
    this.backColor = new Float32Array([0, 0, 0]);
    this.tintColor = new Float32Array([1, 1, 1, 1]);
  }

  set backColor(backColor: Float32Array) {
    this._backColor = backColor;
    this.uniforms["backColor"] = backColor;
  }
  get backColor(): Float32Array {
    return this._backColor;
  }

  set tintColor(tintColor: Float32Array) {
    this._tintColor = tintColor;
    this.uniforms["tintColor"] = tintColor;
  }
  get tintColor(): Float32Array {
    return this._tintColor;
  }

  /**
   * 设置白度
   * @param value 0-1
   */
  set flash(value: number) {
    this._flash = value;
    this._gray = 1;
    this.updateColor();
  }
  get flash(): number {
    return this._flash;
  }
  /**
   * 设置灰度
   * @param value 0-1
   */
  set gray(value: number) {
    this._flash = 0;
    this._gray = value;
    this.updateColor();
  }
  get gray(): number {
    return this._gray;
  }

  private updateColor(){
    this.backColor = new Float32Array([this._flash, this._flash, this._flash]);
    this.tintColor = new Float32Array([this._gray, this._gray, this._gray, 1]);
  }

  /**
   * 设置正常
   */
  setNormal(){
    this._flash = 0;
    this._gray = 1;
    this.updateColor();
  }
}
