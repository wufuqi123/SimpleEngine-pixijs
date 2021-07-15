import { Filter } from "pixi.js";

let vertRadialBlur = `
        attribute vec2 aVertexPosition;
        attribute vec2 aTextureCoord;

        uniform mat3 projectionMatrix;

        varying vec2 vTextureCoord;

        void main(void) {
            gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
            vTextureCoord = aTextureCoord;
        }`;
let fragRadialBlur = `varying vec2 vTextureCoord;
        uniform vec3 iResolution;
        uniform vec2 iCenter;
        uniform vec4 color;
        uniform sampler2D uSampler;
        
        void mainImage( out vec4 fragColor, in vec2 fragCoord )
        {
            //const float Strength = 0.125;    
            const float Strength = 0.015;    
            const int Samples = 64; //multiple of 2
            
            vec2 uv = fragCoord.xy;
            
            vec2 dir = (fragCoord.xy-iCenter.xy);
        
            vec4 colorRead = vec4(0.0,0.0,0.0,0.0);
            
            for (int i = 0; i < Samples; i += 2) //operating at 2 samples for better performance
            {
                colorRead += texture2D(uSampler,uv+float(i)/float(Samples)*dir*Strength) * color;
                colorRead += texture2D(uSampler,uv+float(i+1)/float(Samples)*dir*Strength) * color;
            }   
            
            fragColor = colorRead/float(Samples);
        }
        void main(void){
            mainImage(gl_FragColor, vTextureCoord);
        }`;
/**
 * 径向模糊
 */
export class RadialBlurFilter extends Filter {
  private _width: number = 0;
  private _height: number = 0;
  private _center: number = 0;
  constructor() {
    super(vertRadialBlur, fragRadialBlur);
    this.width = 0;
    this.height = 0;
    this.center = 0.9;
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
   * 0-1
   */
  set center(center: number) {
    this._center = center;
    this.uniforms["iCenter"] = center;
  }
  get center(): number {
    return this._center;
  }
}
