import { Component } from "../../core/Component";
import { Graphics, Point } from "pixi.js";
export class Canvas extends Component {
  private mGraphics!: Graphics;
  draw() {
    if (!this.mGraphics) {
      this.mGraphics = new Graphics();
      this.addChild(this.mGraphics);
    }
  }
  getDisplayComponent(): Graphics{
    return this.mGraphics;
  }
  /**
   * 清除绘制内容
   */
  clear() {
    this.mGraphics.clear();
  }
  /**
   * 对自上一次调用beginFill（）方法以来添加的线条和形状应用填充。
   */
  endFill() {
    this.mGraphics.endFill();
  }
  closePath() {
    this.mGraphics.closePath();
  }
  /**
   * 指定用于随后调用Graphics方法（例如lineTo（）方法或drawCircle（）方法）的线型。
   * @param width 	画线的宽度，将更新对象存储的样式
   * @param color 	绘制线条的颜色，将更新对象存储的样式
   * @param alpha 	绘制线条的透明度，将更新对象存储的样式
   * @param alignment 	绘制线的对齐方式，（0 =内部，0.5 =中间，1 =外部）
   * @param native 	如果为true，则将使用LINES而非TRIANGLE_STRIP绘制线条
   */
  lineStyle(
    width?: number,
    color?: number,
    alpha?: number,
    alignment?: number,
    native?: boolean
  ) {
    this.mGraphics.lineStyle(width, color, alpha, alignment, native);
  }
  /**
   *  使用当前线型从当前绘图位置到（x，y）绘制一条线；然后将当前图形位置设置为（x，y）。
   * @param x 	要绘制到的X坐标
   * @param y 	要绘制到的Y坐标
   */
  lineTo(x: number, y: number) {
    this.mGraphics.lineTo(x, y);
  }
  /**
   *  将当前图形位置移动到x，y。
   * @param x 	要移动到的X坐标
   * @param y 	要移动到的Y坐标
   */
  moveTo(x: number, y: number) {
    this.mGraphics.moveTo(x, y);
  }
  /**
   * 圆弧方法创建圆弧/曲线（用于创建圆或圆的一部分）。
   * @param cx 	圆心的x坐标
   * @param cy 		圆心的y坐标
   * @param radius 	圆的半径
   * @param startAngle 	起始角 0-360
   * @param endAngle 	终止角 0-360
   * @param anticlockwise (可选的) 指定图形是逆时针还是顺时针。False是默认值，表示顺时针，而true表示逆时针。
   */
  arc(
    cx: number,
    cy: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    anticlockwise?: boolean
  ) {
    startAngle = (Math.PI * 2) * (startAngle / 360);
    endAngle = (Math.PI * 2) * (endAngle / 360);
    this.mGraphics.arc(cx, cy, radius, startAngle, endAngle, anticlockwise);
  }
  /**
   *  方法在画布上的两个切线之间创建弧/曲线。
   * @param x1 	圆弧的第一个切点的x坐标
   * @param y1 	圆弧的第一个切点的y坐标
   * @param x2 	圆弧末端的x坐标
   * @param y2 	圆弧末端的y坐标
   * @param radius 	圆的半径
   */
  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number) {
    this.mGraphics.arcTo(x1, y1, x2, y2, radius);
  }
  /**
   * 指定一个简单的单色填充，在绘制时随后对其他Graphics方法（例如lineTo（）或drawCircle（））的调用将使用该单色填充。
   * @param color 填充的颜色
   * @param alpha 填充的透明度
   */
  beginFill(color?: number, alpha?: number) {
    this.mGraphics.beginFill(color, alpha);
  }
  /**
   * 计算贝塞尔曲线的点，然后绘制它
   * @param cpX 控制点x
   * @param cpY 控制点y
   * @param cpX2 第二控制点x
   * @param cpY2 第二控制点y
   * @param toX 	目的点x
   * @param toY 终点y
   */
  bezierCurveTo(
    cpX: number,
    cpY: number,
    cpX2: number,
    cpY2: number,
    toX: number,
    toY: number
  ) {
    this.mGraphics.bezierCurveTo(cpX, cpY, cpX2, cpY2, toX, toY);
  }
  /**
   * 画一个圆。
   * @param x 	圆心的X坐标
   * @param y 	圆心的Y坐标
   * @param radius 圆的半径
   */
  drawCircle(x: number, y: number, radius: number) {
    this.mGraphics.drawCircle(x, y,radius);
  }
  /**
   * 绘制一个椭圆。
   * @param x 椭圆中心的X坐标
   * @param y 椭圆中心的Y坐标
   * @param width 椭圆的一半宽度
   * @param height 	椭圆的半高
   */
  drawEllipse(x: number, y: number, width: number, height: number) {
    this.mGraphics.drawEllipse(x, y,width,height);
  }
  /**
   * 绘制一个矩形。
   * @param x 矩形左上角的X坐标
   * @param y 矩形左上角的Y坐标
   * @param width 矩形的宽度
   * @param height 矩形的高度
   */
  drawRect(x: number, y: number, width: number, height: number) {
    this.mGraphics.drawRect(x, y,width,height);
  }
  /**
   * 绘制一个圆角矩形。
   * @param x 矩形左上角的X坐标
   * @param y 矩形左上角的Y坐标
   * @param width 矩形的宽度
   * @param height 矩形的高度
   * @param radius 矩形角的半径
   */
  drawRoundedRect(x: number, y: number, width: number, height: number,radius: number) {
    this.mGraphics.drawRoundedRect(x, y,width,height,radius);
  }
  /**
   * 用任意数量的点画一个星形。
   * @param x 星的中心X位置
   * @param y 星的中心Y位置
   * @param points 星星的点数必须> 1
   * @param radius 恒星的外半径
   * @param innerRadius 点之间的内半径，默认为一半
   * @param rotation 恒星自转的旋转 0- 360
   */
  drawStar(x: number, y: number, points: number, radius: number, innerRadius?: number, rotation?: number) {
    if(rotation!=undefined){
      rotation = (Math.PI * 2) * (rotation / 360);
    }
    this.mGraphics.drawStar(x, y,points,radius,innerRadius,rotation);
  }

  /**
   * 使用给定的路径绘制多边形。
   * @param path 
   */
  drawPolygon(...path:Array<number>|Array<Point>){
    this.mGraphics.drawPolygon(path);
  }
}
