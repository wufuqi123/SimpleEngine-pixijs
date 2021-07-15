import { Texture } from "pixi.js";
import { EmitterConfig } from "pixi-particles";
/**
 * 粒子相关数据
 */
export class ParticleData {
  public textureArr:Array<Texture> = new Array();
  public emitterConfig:EmitterConfig = <any>{};
  public atlas!:{pages:Array<string>,urls:Array<string>,names:Array<string>};
}