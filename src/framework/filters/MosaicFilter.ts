import { Filter } from "pixi.js";

let vertMosaic = `
        attribute vec2 aVertexPosition;
        attribute vec2 aTextureCoord;

        uniform mat3 projectionMatrix;

        varying vec2 vTextureCoord;

        void main(void) {
            gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
            vTextureCoord = aTextureCoord;
        }`;
let fragMosaic = `varying vec2 vTextureCoord;
        uniform vec3 iResolution;
        uniform float mosaicSize;
        uniform vec4 color;
        uniform sampler2D uSampler;
        
        void main(void){
            vec4 colorRead;
            vec2 xy = vec2(vTextureCoord.x * iResolution.x, vTextureCoord.y * iResolution.y);
            vec2 xyMosaic = vec2(floor(xy.x / mosaicSize) * mosaicSize, floor(xy.y / mosaicSize) * mosaicSize);
            vec2 xyFloor = vec2(floor(mod(xy.x, mosaicSize)), floor(mod(xy.y, mosaicSize)));
            vec2 uvMosaic = vec2(xyMosaic.x / iResolution.x, xyMosaic.y / iResolution.y);
            colorRead = texture2D( uSampler, uvMosaic);
            gl_FragColor = colorRead * color; 
        }`;
        
/**
 * 方形马赛克
 */
export class MosaicFilter extends Filter {
  private _width: number = 0;
  private _height: number = 0;
  private _mosaicSize: number = 0;
  constructor() {
    super(vertMosaic, fragMosaic);
    this.width = 0;
    this.height = 0;
    this.mosaicSize = 16;
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
  set mosaicSize(mosaicSize: number) {
    this._mosaicSize = mosaicSize;
    this.uniforms["mosaicSize"] = mosaicSize;
  }
  get mosaicSize(): number {
    return this._mosaicSize;
  }
}
