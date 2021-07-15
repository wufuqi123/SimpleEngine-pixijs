import { Point } from "pixi.js";

export class CircleUtils {
  /**
   * 获取弧度路径下的坐标轴
   * @param x 圆心X坐标
   * @param y 圆心Y坐标
   * @param radius 半径
   * @param startAngle 开始角度 0-360
   * @param endRadian 结束角度 0-360
   */
  static getRadianPath(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number
  ): Point {
    let startRadian = Math.PI * 2 * (startAngle / 360);
    let endRadian = Math.PI * 2 * (endAngle / 360);
    let radian = Math.PI - startRadian - endRadian;
    let offsetX = radius * Math.sin(radian);
    let offsetY = radius * Math.cos(radian);
    return new Point(x + offsetX, y + offsetY);
  }


  /**
   * 获取圆的路径    
   * @param x 圆心X坐标
   * @param y 圆心X坐标
   * @param radius 半径
   * @param density 密度   密度越大路径越少，密度越小路径越多
   */
  static getPath(
    x: number,
    y: number,
    radius: number,
    density: number = 1
  ): Array<Point> {
    let arr = new Array();
    let count = 360 / density;
    for(var times=0; times<count; times++) {
      var hudu = (2*Math.PI / 360) * (360 / count) * times;
       var X = x + Math.sin(hudu) * radius;
       var Y = y - Math.cos(hudu) * radius;
       arr.push(new Point(X,Y));  
    }
    return arr;
  }
}
