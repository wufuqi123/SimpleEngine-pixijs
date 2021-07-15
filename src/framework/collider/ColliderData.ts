export enum ColliderDataType {
  /**
   * 无数据
   */
  NOTHING = 0,
  /**
   * 矩形
   */
  RECTANGLE,
  /**
   * 圆形
   */
  ROUND,
  // /**   不需要三角形   使用多边形代替
  //  * 三角形
  //  */
  // TRIANGLE,
  /**
   * 多边形
   */
  POLYGON,
}
export class ColliderData {
  public type: ColliderDataType = ColliderDataType.NOTHING;

  /**
   * 矩形
   */
  public rectangle = {
    source: {
      //起始点为左上角点
      /**
       * 矩形起始点x
       */
      x: 0,

      /**
       * 矩形起始点y
       */
      y: 0,

      /**
       * 矩形宽度
       */
      width: 0,

      /**
       * 矩形高度
       */
      height: 0,
    },
    out: {
      //起始点为左上角点
      /**
       * 矩形起始点x
       */
      x: 0,

      /**
       * 矩形起始点y
       */
      y: 0,

      /**
        * 矩形宽度
        */
      width: 0,

      /**
       * 矩形高度
       */
      height: 0,

    
    },
  };

  /**
   * 圆形数据
   */
  public circle = {
    source: {
      x: 0,
      y: 0,
      radius: 0
    },
    out: {
      x: 0,
      y: 0,
      radius: 0
    }
  }

  /**
   * 多边形的数据
   */
  public poLygon = {
    source:new Array(),
    out: new Array(),
  }

}
