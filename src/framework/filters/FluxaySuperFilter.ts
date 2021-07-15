import { Filter } from "pixi.js";
let vertFluxaySuper = `
        attribute vec2 aVertexPosition;
        attribute vec2 aTextureCoord;

        uniform mat3 projectionMatrix;

        varying vec2 vTextureCoord;

        void main(void) {
            gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
            vTextureCoord = aTextureCoord;
        }`;
let fragFluxaySuper = `varying vec2 vTextureCoord;
        uniform float time;
        uniform vec4 color;
        uniform sampler2D uSampler;
        #define TAU 6.12
        #define MAX_ITER 5
        
        void main(void){
            float time = time * .5+5.;
            // uv should be the 0-1 uv of texture...
            vec2 uv = vTextureCoord.xy;//fragCoord.xy / iResolution.xy;
            
            vec2 p = mod(uv*TAU, TAU)-250.0;
        
            vec2 i = vec2(p);
            float c = 1.0;
            float inten = .0045;
        
            for (int n = 0; n < MAX_ITER; n++) 
            {
                float t =  time * (1.0 - (3.5 / float(n+1)));
                i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(1.5*t + i.x));
                c += 1.0/length(vec2(p.x / (cos(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
            }
            c /= float(MAX_ITER);
            c = 1.17-pow(c, 1.4);
            vec4 tex = texture2D(uSampler,uv);
            vec3 colour = vec3(pow(abs(c), 20.0));
            colour = clamp(colour + vec3(0.0, 0.0, .0), 0.0, tex.a);
        
            // 混合波光
            float alpha = c*tex[3];  
            tex[0] = tex[0] + colour[0]*alpha; 
            tex[1] = tex[1] + colour[1]*alpha; 
            tex[2] = tex[2] + colour[2]*alpha; 
            gl_FragColor = color * tex;
        }`;
export class FluxaySuperFilter extends Filter {
  private _fluxay: number = 0;
  constructor() {
    super(vertFluxaySuper, fragFluxaySuper);
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
