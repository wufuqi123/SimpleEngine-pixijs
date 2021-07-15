import { Filter } from "pixi.js";
const vertFluxay = `
        attribute vec2 aVertexPosition;
        attribute vec2 aTextureCoord;

        uniform mat3 projectionMatrix;

        varying vec2 vTextureCoord;

        void main(void) {
            gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
            vTextureCoord = aTextureCoord;
        }`;
const fragFluxay = `varying vec2 vTextureCoord;
        uniform float time;
        uniform vec4 color;
        uniform sampler2D uSampler;
        
        void main(void){
            vec4 src_color = color * texture2D(uSampler, vTextureCoord);
        
            float width = 0.03;       //流光的宽度范围 (调整该值改变流光的宽度)
            float start = tan(time/1.414);  //流光的起始x坐标
            float strength = 0.05;   //流光增亮强度   (调整该值改变流光的增亮强度)
            float offset = 0.5;      //偏移值         (调整该值改变流光的倾斜程度)
            if(vTextureCoord.x < (start - offset * vTextureCoord.y) &&  vTextureCoord.x > (start - offset * vTextureCoord.y - width))
            {
                vec3 improve = strength * vec3(255, 255, 255);
                vec3 result = improve * vec3( src_color.r, src_color.g, src_color.b);
                gl_FragColor = vec4(result, src_color.a);
        
            }else{
                gl_FragColor = src_color;
            }
        }`;
/**
 * 流光效果
 */
export class FluxayFilter extends Filter {
  private _fluxay: number = 0;
  constructor() {
    super(vertFluxay, fragFluxay);
    this.fluxay = 0;
  }
  /**
   * 流光  0-1
   */
  set fluxay(fluxay: number) {
    this._fluxay = fluxay;
    this.uniforms["time"] = 1.414 * fluxay;
  }
  get fluxay(): number {
    return this._fluxay;
  }
}
