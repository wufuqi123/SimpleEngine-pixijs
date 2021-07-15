import { Filter } from "pixi.js";

let vertWater = `
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 uv0;

void main(void) {
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    uv0 = aTextureCoord;
}`;
let fragWater = `uniform sampler2D uSampler;
uniform vec3 iResolution;
uniform float iTime;
varying vec2 uv0;

#define F cos(x-y)*cos(y),sin(x+y)*sin(y)

vec2 s(vec2 p)
{
    float d=iTime*0.2,x=8.*(p.x+d),y=8.*(p.y+d);
    return vec2(F);
}
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // 换成resolution
    vec2 rs = iResolution.xy;
    // 换成纹理坐标v_texCoord.xy
    vec2 uv = fragCoord;
    vec2 q = uv+2./iResolution.x*(s(uv)-s(uv+rs));
    //反转y
    //q.y=1.-q.y;
    fragColor = texture2D(uSampler, q);
}
void main()
{
    mainImage(gl_FragColor, uv0.xy);
}`;
/**
 * 水
 */
export class WaterFilter extends Filter {
  private _width: number = 0;
  private _height: number = 0;
  private _time: number = 0;
  constructor() {
    super(vertWater, fragWater);
    this.width = 0;
    this.height = 0;
    this.time = 0;
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
  private updateiResolution() {
    this.uniforms["iResolution"] = new Float32Array([
      this.width,
      this.height,
      0,
    ]);
  }
  /**
   * 从0开始的毫秒数
   */
  set time(time: number) {
    this._time = time;
    this.uniforms["iTime"] = time / 1000;
  }
  get time(): number {
    return this._time;
  }
  updata(delta:number){
    this.time += delta;
  }
}
