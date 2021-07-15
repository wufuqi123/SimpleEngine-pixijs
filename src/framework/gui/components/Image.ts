import { Component } from "../../core/Component";
import { Sprite, Texture, Point, utils } from "pixi.js";
import { Log } from "../../log/Log";
export class Image extends Component {
  protected rootSprite!: Sprite;
  protected _color!: number | string;
  public __isImage = true;



  draw() {
    if (!this.rootSprite) {
      this.rootSprite = new Sprite();
      this.addChild(this.rootSprite);
    }
  }

  containsPoint(p: Point): boolean {
    return this.rootSprite.containsPoint(p);
  }

  getDisplayComponent(): Sprite {
    return this.rootSprite;
  }

  /**
   *  是否为反向遮罩
   */
  set reverseMask(reverseMask:boolean){
    (<any>this.rootSprite).reverseMask = reverseMask;
  }
  get reverseMask():boolean{
    return !!(<any>this.rootSprite).reverseMask;
  }

  set tint(tint: number) {
    this.rootSprite.tint = tint;
  }
  get tint(): number {
    return this.rootSprite.tint;
  }
  set color(color: number | string) {
    if (typeof color == "string") {
      this.tint = utils.string2hex(color);
    } else {
      this.tint = color;
    }
  }
  get color(): number | string {
    if (this._color == undefined) {
      return this.tint;
    }
    return this._color;
  }
  set texture(texture: Texture) {
    if (texture == this.texture) {
      return;
    }
    let disposeTexture: Texture | undefined;
    if (this.rootSprite.texture && this.rootSprite.texture != texture) {
      disposeTexture = this.rootSprite.texture;
    }

    this.rootSprite.texture = texture;
    if (disposeTexture && disposeTexture.baseTexture) {
      disposeTexture.baseTexture.dispose();
    }
  }
  get texture(): Texture {
    return this.rootSprite.texture;
  }
  set width(width: number) {
    this.rootSprite.width = width;
  }
  get width(): number {
    return this.rootSprite.width;
  }
  set height(height: number) {
    this.rootSprite.height = height;
  }
  get height(): number {
    return this.rootSprite.height;
  }
  set anchor(anchor: Point) {
    this.rootSprite.anchor = anchor;
  }
  get anchor(): Point {
    return this.rootSprite.anchor;
  }
  destroy(options?: {
    children?: boolean;
    texture?: boolean;
    baseTexture?: boolean;
  }) {
    let currOptions = {
      children: options?.children
    };
    if (this.texture && this.texture.baseTexture) {
      this.texture.baseTexture.dispose();
    }
    super.destroy(currOptions);
  }
}