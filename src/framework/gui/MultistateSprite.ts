import { Sprite, Texture,utils } from "pixi.js";
export class MultistateSprite extends Sprite {
  public stateTextures: Map<string, Texture> = new Map();
  protected _color!: number|string;
  constructor(texture?: Texture) {
    super(texture);
    if (texture) {
      this.stateTextures.set("default", texture);
    }
  }
  set color(color: number|string) {
    if(typeof color == "string"){
      this.tint = utils.string2hex(color);
    }else{
      this.tint = color;
    }
  }
  get color(): number|string {
    if(this._color == undefined){
      return  this.tint;
    }
    return this._color;
  }
  public addState(state: string, texture: Texture) {
    this.stateTextures.set(state, texture);
  }
  public setDefaultState(texture: Texture) {
    this.stateTextures.set("default", texture);
  }
  public getState(state: string): Texture | undefined {
    return this.stateTextures.get(state);
  }
  public hasState(state: string): boolean {
    return !!this.stateTextures.get(state);
  }
  public setState(state: string = "default") {
    var sprite: any = this;
    let texture: Texture | undefined = sprite.stateTextures.get(state);
    
    // console.log("jjjjjjjj",texture.textureCacheIds,state);
    if (!texture) return;
    if (sprite.texture && sprite.texture!=texture && sprite.texture.baseTexture) {
      sprite.texture.baseTexture.dispose();
    }
    // console.log("加载图片：",state,texture)
    sprite.texture = texture;
  }
  destroy(options?: {
    children?: boolean;
    texture?: boolean;
    baseTexture?: boolean;
  }){
    if (this.texture && this.texture.baseTexture) {
      this.texture.baseTexture.dispose();
    }
    (<any>this).texture = null;
    super.destroy(options);
  }
}
