import { utils } from "pixi.js";
/**
 * 颜色工具
 */
export class ColorUtils {
  /**
   * 16进制颜色  转  string 颜色
   * 0xffffff => #ffffff
   * @param hex
   */
  public static hex2string(hex: number): string {
    return utils.hex2string(hex);
  }
  /**
   * 16进制颜色  转  rgb 比例  0 - 1 颜色
   *
   * 0xffffff => [1, 1, 1]
   * @param hex
   */
  public static hex2rgbRadix(hex: number): number[] {
    return utils.hex2rgb(hex);
  }

  /**
   * 16进制颜色  转 rgb  0 - 255 颜色
   * 0xffffff => [255, 255, 255]
   * @param hex
   */
  public static hex2rgb(hex: number): number[] {
    return this.rgbRadix2rgb(this.hex2rgbRadix(hex));
  }

  /**
   * string 颜色  转  16进制颜色
   * #ffffff => 0xffffff
   * @param hex
   */
  public static string2hex(str: string): number {
    return utils.string2hex(str);
  }

  /**
   * string 颜色  转  rgb 0 - 255 颜色
   *
   * #ffffff => [255, 255, 255]
   * @param str
   */
  public static string2rgb(str: string): number[] {
    return this.hex2rgb(this.string2hex(str));
  }

  /**
   * string 颜色  转  rgb 比例  0 - 1 颜色
   *
   * #ffffff => [1, 1, 1]
   * @param str
   */
  public static string2rgbRadix(str: string): number[] {
    return utils.hex2rgb(this.string2hex(str));
  }

  /**
   * rgb  比例  0 - 1 颜色 转 16进制颜色
   * [1, 1, 1] => 0xffffff
   * @param rgb
   */
  public static rgbRadix2hex(rgb: number[]): number {
    if (rgb.length != 3 || isNaN(rgb[0]) || isNaN(rgb[1]) || isNaN(rgb[2])) {
      throw new Error(`rgb 颜色出错${rgb.toString()},应该为[1, 1, 1]`);
    }
    return utils.rgb2hex(rgb);
  }
  /**
   * rgb  比例  0 - 1 颜色 转 string 颜色
   * [1, 1, 1] => #ffffff
   * @param rgb
   */
  public static rgbRadix2string(rgb: number[]): string {
    return this.hex2string(this.rgbRadix2hex(rgb));
  }

  /**
   * rgb  比例  0 - 1 颜色 转 rgb  0 - 255 颜色
   * [1, 1, 1] => [255, 255, 255]
   * @param rgb
   */
  public static rgbRadix2rgb(rgb: number[]): number[] {
    if (rgb.length != 3 || isNaN(rgb[0]) || isNaN(rgb[1]) || isNaN(rgb[2])) {
      throw new Error(`rgb 颜色出错${rgb.toString()},应该为[1, 1, 1]`);
    }
    if (rgb[0] <= 1 && rgb[1] <= 1 && rgb[2] <= 1) {
      rgb[0] *= 255;
      rgb[1] *= 255;
      rgb[2] *= 255;
    }
    if (rgb[0] > 255 || rgb[1] > 255 || rgb[2] > 255) {
      throw new Error(`rgb 颜色出错${rgb.toString()},应该为[1, 1, 1]`);
    }
    return rgb;
  }

  /**
   * rgb  0 - 255 颜色 转 16进制颜色
   * [255, 255, 255] => 0xffffff
   * @param rgb
   */
  public static rgb2hex(rgb: number[]): number {
    if (rgb.length != 3 || isNaN(rgb[0]) || isNaN(rgb[1]) || isNaN(rgb[2])) {
      throw new Error(`rgb 颜色出错${rgb.toString()},应该为[255, 255, 255]`);
    }
    return this.rgbRadix2hex(this.rgb2rgbRadix(rgb));
  }
  /**
   * rgb  0 - 255 颜色 转 string 颜色
   * [255, 255, 255] => #ffffff
   * @param rgb
   */
  public static rgb2string(rgb: number[]): string {
    if (rgb.length != 3 || isNaN(rgb[0]) || isNaN(rgb[1]) || isNaN(rgb[2])) {
      throw new Error(`rgb 颜色出错${rgb.toString()},应该为[255, 255, 255]`);
    }
    return this.rgbRadix2string(this.rgb2rgbRadix(rgb));
  }

  /**
   * rgb  0 - 255 颜色 转 rgb 比例  0 - 1 颜色
   * [255, 255, 255] => [1, 1, 1]
   * @param rgb
   */
  public static rgb2rgbRadix(rgb: number[]): number[] {
    if (rgb.length != 3 || isNaN(rgb[0]) || isNaN(rgb[1]) || isNaN(rgb[2])) {
      throw new Error(`rgb 颜色出错${rgb.toString()},应该为[255, 255, 255]`);
    }
    if (rgb[0] <= 255 && rgb[1] <= 255 && rgb[2] <= 255) {
      rgb[0] /= 255;
      rgb[1] /= 255;
      rgb[2] /= 255;
    }
    if (rgb[0] > 1 || rgb[1] > 1 || rgb[2] > 1) {
      throw new Error(`rgb 颜色出错${rgb.toString()},应该为[255, 255, 255]`);
    }
    return rgb;
  }
}
