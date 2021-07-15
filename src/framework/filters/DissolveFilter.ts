import { Filter } from "pixi.js";
const vertDissolve = `
        attribute vec2 aVertexPosition;
        attribute vec2 aTextureCoord;

        uniform mat3 projectionMatrix;

        varying vec2 vTextureCoord;

        void main(void) {
            gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
            vTextureCoord = aTextureCoord;
        }`;
const fragDissolve = `varying vec2 vTextureCoord;
        uniform float time;
        uniform vec4 color;
        uniform sampler2D uSampler;
        
        void main(void){
            vec4 c = texture2D(uSampler,vTextureCoord);
            float height = c.g;
            if(height < time)
            {
              discard;
            }

            gl_FragColor = c;
        }`;

/**
 * 溶解效果
 */
export class DissolveFilter extends Filter {
  private _dissolve: number = 0;
  constructor() {
    super(vertDissolve, fragDissolve);
    this.dissolve = 0;
  }
  /**
   * 溶解  0-1
   */
  set dissolve(dissolve: number) {
    this._dissolve = dissolve;
    this.uniforms["time"] = dissolve;
    // this.uniforms["time"] = 0.9;
  }
  get dissolve(): number {
    return this._dissolve;
  }
}
