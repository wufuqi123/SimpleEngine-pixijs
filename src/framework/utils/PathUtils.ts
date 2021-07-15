export class PathUtils {
  /**
   * 获取url 参数
   * @param variable
   */
  public static getQueryVariable(variable: string): string | undefined {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return undefined;
  }


  /**
   * 移除点    ./url.path    返回   url.path
   * @param url 
   */
  public static getRemoveDot(url: string): string{
    if(url.indexOf("./") == 0){
      return PathUtils.getRemoveDot(url.substring(2,url.length));
    }
    return url;
  }
}
