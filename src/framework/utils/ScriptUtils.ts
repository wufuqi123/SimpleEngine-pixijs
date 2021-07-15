export class ScriptUtils {
 /**
   * 加载  js文件
   * @param url
   * @param callback
   */
  static getScript(url: string, callback?: Function) {
    let head = document.getElementsByTagName("body")[0],
      js = document.createElement("script");

    js.setAttribute("type", "text/javascript");
    js.setAttribute("src", url);
    js.setAttribute("crossorigin", "anonymous");

    head.appendChild(js);

    //执行回调
    let callbackFn = function () {
      if (typeof callback === "function") {
        callback();
      }
    };

    if (document.all) {
      //IE
      js.onreadystatechange = function () {
        if (js.readyState == "loaded" || js.readyState == "complete") {
          callbackFn();
        }
      };
    } else {
      js.onload = function () {
        callbackFn();
      };
    }
  }
}