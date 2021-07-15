import { Filter } from "pixi.js";
let vertMask = `
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void) {
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`;
let fragMask = `varying vec2 vTextureCoord;
uniform float u_edge;
uniform vec4 color;
uniform sampler2D uSampler;

void main(void){
    float edge = u_edge;
    float dis = 0.0;
    vec2 texCoord = vTextureCoord;
    if ( texCoord.x < edge )
    {
        if ( texCoord.y < edge )
        {
            dis = distance( texCoord, vec2(edge, edge) );
        }
        if ( texCoord.y > (1.0 - edge) )
        {
            dis = distance( texCoord, vec2(edge, (1.0 - edge)) );
        }
    }
    else if ( texCoord.x > (1.0 - edge) )
    {
        if ( texCoord.y < edge )
        {
            dis = distance( texCoord, vec2((1.0 - edge), edge ) );
        }
        if ( texCoord.y > (1.0 - edge) )
        {
            dis = distance( texCoord, vec2((1.0 - edge), (1.0 - edge) ) );
        }
    }

    if(dis > 0.001)
    {
        // 外圈沟
        float gap = edge * 0.02;
        if(dis <= edge - gap)
        {
            gl_FragColor = texture2D( uSampler,texCoord) * color;
        }
        else if(dis <= edge)
        {
            // 平滑过渡
            float t = smoothstep(0.,gap,edge-dis);
            vec4 color = texture2D( uSampler,texCoord) * color;
            gl_FragColor = vec4(color.rgb,t);
        }else{
            gl_FragColor = vec4(0.,0.,0.,0.);
        }
    }
    else
    {
        gl_FragColor = texture2D( uSampler,texCoord) * color;
    }
}`;
/**
 * 椭圆或圆形Mask
 */
export class MaskFilter extends Filter {
  private _edge: number = 0;
  constructor() {
    super(vertMask, fragMask);
    this.edge = 0;
  }
  /**
   * edge
   */
  set edge(edge: number) {
    this._edge = edge;
    this.uniforms["u_edge"] = edge;
  }
  get edge(): number {
    return this._edge;
  }
}
