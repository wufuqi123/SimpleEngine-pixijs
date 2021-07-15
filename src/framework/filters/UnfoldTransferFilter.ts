import { Filter } from "pixi.js";
let vertUnfoldTransfer = `
        attribute vec2 aVertexPosition;
        attribute vec2 aTextureCoord;

        uniform mat3 projectionMatrix;

        varying vec2 uv0;

        void main(void) {
            gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
            uv0 = aTextureCoord;
        }`;
let fragUnfoldTransfer = `uniform sampler2D uSampler;
        uniform vec4 color;
        uniform float time;
        varying vec2 uv0;
        
        void main()
        {
            vec4 result = vec4(1.0,1.0,1.0,1.0);
            vec2 translate = vec2(uv0.x,uv0.y);
            result = texture2D(uSampler, uv0);
            
            // Calculate modulo to decide even and odd row
            float div = 2.0;
            float num = floor(uv0.y * 10.0);
            float odd = num - (div * floor(num/div));
            
            float t = mod(time,1.0);
            
            //Only do the odd number
            if( odd == 0.0){
                translate.x = translate.x - t;        
                result = texture2D(uSampler,translate);
                if(translate.x < 0.0){
                    discard;
                }
            }
            else{
                translate.x = translate.x + t;        
                result = texture2D(uSampler,translate);
                if(translate.x > 1.0){
                    discard;
                }
            }
            
            // Output to screen
            gl_FragColor = result;
        }`;
export class UnfoldTransferFilter extends Filter {
  private _transfer: number = 0;
  constructor() {
    super(vertUnfoldTransfer, fragUnfoldTransfer);
    this.transfer = 0;
  }
  /**
   * 溶解  0-1
   */
  set transfer(transfer: number) {
    this._transfer = transfer;
    if(transfer>=1){
      transfer = 0.999;
    }
    this.uniforms["time"] = transfer;
  }
  get transfer(): number {
    return this._transfer;
  }
}
