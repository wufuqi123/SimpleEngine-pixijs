import { Filter } from "pixi.js";

let vertWindowTransfer = `
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 uv0;

void main(void) {
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    uv0 = aTextureCoord;
}`;
let fragWindowTransfer = `uniform sampler2D uSampler;
uniform vec4 color;
varying vec2 uv0;
uniform float time;


void main()
{

    float dur = 2.;
    float dim = 7.;
    vec2 v = uv0;
    v.y=1.-v.y;
    vec2 x = mod(1.-v.xx, 1./dim)+floor(v*dim)/dim;
    float a = .5*(abs(x.x)+abs(x.y));
    float b = fract(time/dur);
    a=a>b?0.:1.;
    bool mt = mod(floor(time/dur),2.)==0.;
    float cd = a;
    if (mt)
    {
        cd=1.-cd;    
    }
    vec4 colore = vec4(0.5,0.2,0.3, 0.01);
    gl_FragColor = mix(vec4(a),(mix(texture2D(uSampler, uv0), colore, cd)), 1.);

}`;
export class WindowTransferFilter extends Filter {
  private _transfer: number = 0;
  constructor() {
    super(vertWindowTransfer, fragWindowTransfer);
    this.transfer = 0;
  }
  /**
   * 溶解  0-1
   */
  set transfer(transfer: number) {
    this._transfer = transfer;
    this.uniforms["time"] = 4 * transfer;
  }
  get transfer(): number {
    return this._transfer;
  }
}
