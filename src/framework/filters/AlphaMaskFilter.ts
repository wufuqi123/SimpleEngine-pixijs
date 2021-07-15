import { Filter } from "pixi.js";
const vertAlphaMask = `
        attribute vec2 aVertexPosition;
        attribute vec2 aTextureCoord;

        uniform mat3 projectionMatrix;

        varying vec2 vTextureCoord;

        void main(void) {
            gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
            vTextureCoord = aTextureCoord;
        }`;
const fragAlphaMask = `varying vec2 vTextureCoord;
        uniform sampler2D uSampler;
        uniform float alpha;
        
        void main(void){
            vec4 c = texture2D(uSampler,vTextureCoord);
            if(c.a < alpha)
            {
              discard;
            }

            gl_FragColor = c;
        }`;


export class AlphaMaskFilter extends Filter {
  private _alpha: number = 0;
  constructor() {
    super(vertAlphaMask, fragAlphaMask);
    this.alpha = 0.5;
  }

  set alpha(alpha: number) {
    this._alpha = alpha;
    this.uniforms["alpha"] = alpha;
  }
  get alpha(): number {
    return this._alpha;
  }
}
