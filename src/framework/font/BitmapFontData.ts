import { Texture } from "pixi.js";

export class BitmapFontData {
  info!: {
    aa: number;
    bold: number;
    charset: string;
    face: string;
    italic: number;
    outline: number;
    padding: Array<number>;
    size: number;
    smooth: number;
    spacing: Array<number>;
    stretchH: number;
    unicode: number;
  };
  charCount!: number;
  pages!: Array<{ id: number; file: string; texture: Texture; alias: string }>;
  chars!: Array<{
    id: number;
    height: number;
    width: number;
    page: number;
    chnl: number;
    x: number;
    y: number;
    xadvance: number;
    xoffset: number;
    yoffset: number;
    texture: Texture;
  }>;
  charMap:Map<number,{
    id: number;
    height: number;
    width: number;
    page: number;
    chnl: number;
    x: number;
    y: number;
    xadvance: number;
    xoffset: number;
    yoffset: number;
    texture: Texture;
  }> = new Map();
}
