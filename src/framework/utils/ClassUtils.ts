export class ClassUtils {
  /**
   * js  获取类名
   */
  static getConstructorName = function(obj: any) {
    var str = (obj.prototype
      ? obj.prototype.constructor
      : obj.constructor
    ).toString();
    var cname = str.match(/function\s(\w*)/)[1];
    var aliases = ["", "anonymous", "Anonymous"];
    return aliases.indexOf(cname) > -1 ? "Function" : cname;
  };
}
