import { Filter } from "pixi.js";
let vertGaussBlurs = `
        attribute vec2 aVertexPosition;
        attribute vec2 aTextureCoord;

        uniform mat3 projectionMatrix;

        varying vec2 vTextureCoord;

        void main(void) {
            gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
            vTextureCoord = aTextureCoord;
        }`;
let fragGaussBlurs = `varying vec2 vTextureCoord;
        uniform vec4 color;
        uniform sampler2D uSampler;
        uniform float bluramount;

        vec4 draw(vec2 uv) {
            return texture2D(uSampler, uv) * color; 
        }
    
        float grid(float var, float size) {
            return floor(var*size)/size;
        }
    
        float rand(vec2 co){
            return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
        }
        void mainImage( out vec4 fragColor, in vec2 vTextureCoord )
        {
            vec2 uv = vTextureCoord.xy;
            vec4 blurred_image = vec4(0.);
            #define repeats 5.
            for (float i = 0.; i < repeats; i++) { 
                vec2 q = vec2(cos(degrees((i/repeats)*360.)),sin(degrees((i/repeats)*360.))) * (rand(vec2(i,uv.x+uv.y))+bluramount); 
                vec2 uv2 = uv+(q*bluramount);
                blurred_image += draw(uv2)/2.;
                q = vec2(cos(degrees((i/repeats)*360.)),sin(degrees((i/repeats)*360.))) * (rand(vec2(i+2.,uv.x+uv.y+24.))+bluramount); 
                uv2 = uv+(q*bluramount);
                blurred_image += draw(uv2)/2.;
            }
            blurred_image /= repeats;
            fragColor = vec4(blurred_image);
        }
        void main(void){
            mainImage(gl_FragColor, vTextureCoord.xy);
        }`;

/**
 * 高斯模糊
 */
export class GaussBlursFilter extends Filter {
  private _blur: number = 0;
  constructor() {
    super(vertGaussBlurs, fragGaussBlurs);
    this.blur = 0;
  }
  /**
   * 模糊
   */
  set blur(blur: number) {
    this._blur = blur;
    this.uniforms["bluramount"] = blur;
  }
  get blur(): number {
    return this._blur;
  }
}
