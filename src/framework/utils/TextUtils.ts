export class TextUtils {
  /**
   * 去两边空格
   * @param {*} text
   */
  static trim(text?: string): string {
    if (text == undefined || text == null) {
      return "";
    }
    text += "";
    return text.replace(/^\s*|\s*$/g, "");
  }
  /**
   * 是否为空
   * @param {*} text
   */
  static isEmpty(text?: string): boolean {
    text = TextUtils.trim(text);
    return text == "";
  }

  /**
   * 阿拉伯数字  转  中文数字
   * @param num 
   */
  static toChinesNum(num: number): string {
    let changeNum = [
      "零",
      "一",
      "二",
      "三",
      "四",
      "五",
      "六",
      "七",
      "八",
      "九",
    ];
    let unit = ["", "十", "百", "千", "万"];
    let getWan = (temp: number | string) => {
      let strArr = temp.toString().split("").reverse();
      let newNum = "";
      for (var i = 0; i < strArr.length; i++) {
        newNum =
          (i == 0 && parseInt(strArr[i]) == 0
            ? ""
            : i > 0 && parseInt(strArr[i]) == 0 && parseInt(strArr[i - 1]) == 0
            ? ""
            : changeNum[parseInt(strArr[i])] +
              (parseInt(strArr[i]) == 0 ? unit[0] : unit[i])) + newNum;
      }
      return newNum;
    };
    let overWan = Math.floor(num / 10000);
    let noWan = num % 10000;
    let noWanStr = "" + noWan;
    // if (noWan.toString().length < 4) {
    //   noWanStr = "0" + noWan;
    // }
    return overWan
      ? getWan(overWan) + "万" + getWan(noWanStr)
      : getWan(noWanStr);
  }
}
