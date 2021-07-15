import { Filter } from "pixi.js";

let vertZoomBlurTransfer = `
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 uv0;

void main(void) {
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    uv0 = aTextureCoord;
}`;
let fragZoomBlurTransfer = `uniform sampler2D uSampler;
uniform vec4 color;
varying vec2 uv0;
uniform float time;

const float strength = 0.3;
const float PI = 3.141592653589793;

float Linear_ease(in float begin, in float change, in float duration, in float time) {
    return change * time / duration + begin;
}

float Exponential_easeInOut(in float begin, in float change, in float duration, in float time) {
    if (time == 0.0)
        return begin;
    else if (time == duration)
        return begin + change;
    time = time / (duration / 2.0);
    if (time < 1.0)
         return change / 2.0 * pow(2.0, 10.0 * (time - 1.0)) + begin;
    return change / 2.0 * (-pow(2.0, -10.0 * (time - 1.0)) + 2.0) + begin;
}

float Sinusoidal_easeInOut(in float begin, in float change, in float duration, in float time) {
    return -change / 2.0 * (cos(PI * time / duration) - 1.0) + begin;
}

float random(in vec3 scale, in float seed) {
    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
}

vec4 crossFade(in vec2 uv, in float dissolve) {
    vec4 colore = vec4(0.0,0.0,0.0,0.0);
    return mix(texture2D(uSampler, uv), colore, dissolve);
}

void main()
{
    float progress = sin(time*0.5) * 0.5 + 0.5;
    vec2 center = vec2(Linear_ease(0.5, 0.0, 1.0, progress),0.5);
    float dissolve = Exponential_easeInOut(0.0, 1.0, 1.0, progress);

    float strength = Sinusoidal_easeInOut(0.0, strength, 0.5, progress);

    vec4 colorx = vec4(0.0);
    float total = 0.0;
    vec2 toCenter = center - uv0;

    float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0)*0.5;

    for (float t = 0.0; t <= 20.0; t++) {
        float percent = (t + offset) / 20.0;
        float weight = 1.0 * (percent - percent * percent);
        colorx += crossFade(uv0 + toCenter * percent * strength, dissolve) * weight;
        total += weight;
    }
    gl_FragColor = colorx / total;
}`;
export class ZoomBlurTransferFilter extends Filter {
  private _transfer: number = 0;
  constructor() {
    super(vertZoomBlurTransfer, fragZoomBlurTransfer);
    this.transfer = 0;
  }
  /**
   * 溶解  0-1
   */
  set transfer(transfer: number) {
    this._transfer = transfer;
    this.uniforms["time"] = Math.PI * 2 * transfer - Math.PI;
  }
  get transfer(): number {
    return this._transfer;
  }
}
