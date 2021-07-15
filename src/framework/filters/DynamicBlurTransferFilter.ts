import { Filter } from "pixi.js";
const vertDynamicBlurTransfer = `
        attribute vec2 aVertexPosition;
        attribute vec2 aTextureCoord;

        uniform mat3 projectionMatrix;

        varying vec2 vTextureCoord;

        void main(void) {
            gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
            vTextureCoord = aTextureCoord;
        }`;
const fragDynamicBlurTransfer = `varying vec2 vTextureCoord;
        uniform float time;
        uniform vec4 color;
        uniform sampler2D uSampler;

        #define SAMPLES 10
        #define SHARPNESS 4.0    
        #define SAMPLES_F float(SAMPLES)
        #define TAU  6.28318530718
        #define HASHSCALE1 443.8975

        float hash13(vec3 p3)
        {
            p3  = fract(p3 * HASHSCALE1);
            p3 += dot(p3, p3.yzx + 19.19);
            return fract((p3.x + p3.y) * p3.z);
        }
        
        void main(void){
            float r = 0.05 + 0.05 * sin(time*.2*TAU+4.3);

            float d = (r * 2.0 * vTextureCoord.x) / SAMPLES_F;
            float lod = log2(max(d / SHARPNESS, 1.0));
            
            vec4 colorRead = vec4(0.0, 0.0, 0.0, 0.0);    
            for (int i = 0; i < SAMPLES; ++i)
            {
                float fi = float(i);
                float rnd = hash13(vec3(vTextureCoord.xy, fi));
                float f = (fi + rnd) / SAMPLES_F;
                f = (f * 2.0 - 1.0) * r;
                colorRead += texture2D(uSampler, vTextureCoord + vec2(f, 0.0), lod) * color;
            }
            colorRead = colorRead / SAMPLES_F;
            gl_FragColor = colorRead;

            gl_FragColor.w = 2.25 - time;
        }`;
export class DynamicBlurTransferFilter extends Filter {
  private _blur: number = 0;

  constructor() {
    super(vertDynamicBlurTransfer, fragDynamicBlurTransfer);
    this.blur = 0;
  }
  /**
   *  0-1
   */
  set blur(blur: number) {
    this._blur = blur;
    this.uniforms["time"] = 1.414 * blur;
  }
  get blur(): number {
    return this._blur;
  }
}
