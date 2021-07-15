import { LoaderResource, resources } from "pixi.js";
import { parse } from "papaparse";
import { ResManager } from "../core/ResManager";
import { Log } from "../log/Log";
export class CSVLoader {
  private static suffix: string[] = ["csv"];
  public static use(resource: LoaderResource, next: () => void): void {
    if (resource.extension && CSVLoader.suffix.includes(resource.extension)) {

      let info = ResManager.getResInfo(resource.name);
      let code = "GB2312";
      if(info?.paramData && info.paramData.encode){
        code = info.paramData.encode;
      }
      CSVLoader.loadData(resource, code, () => {
        let data = <string>resource.data;
        let csvData = undefined;
        let encoding, delimiter;

        if (ResManager.hasResInfo(resource.name)) {
          let info = ResManager.getResInfo(resource.name);
          if (info && info.paramData) {
            encoding = info.paramData.encoding;
            delimiter = info.paramData.delimiter;
          }
        }

        if (typeof data == "string") {
          csvData = parse(data, { encoding, delimiter });
          if (csvData && Array.isArray(csvData.data)) {
            (<any>resource)["csv"] = csvData.data;
            (<any>resource)["csvInfo"] = csvData;
          }
        }
        if (!csvData || !Array.isArray(csvData.data)) {
          resource.error = new Error("parse loaded csv error!");
        }
        next();
      });
      return;
    }
    next();
  }

  /**
   * 真实的走网络加载
   * @param resource 
   * @param code 解码方式    utf-8   GB2312  GBK
   * @param next 
   * @returns 
   */
  private static loadData(resource: LoaderResource, code: string = "utf-8", next: () => void) {
    resource.xhr = null;
    resource.data = null;
    let xhr: any;
    try {
      xhr = new XMLHttpRequest();
    } catch (e) {
      try {
        xhr = new (<any>window).ActiveXObject("Microsoft.XMLHttp");
      } catch (e) { }
    }
    if (!xhr) {
      resource.error = new Error(
        "资源加载出错！！！网络资源异常！" + resource.url + "\n"
      );
      next();
      return;
    }
    xhr.open("GET", resource.url, true);
    xhr.responseType = "blob";
    xhr.onload = function () {
      if (xhr.readyState === 4) {
        if (xhr.status == 200 || xhr.status == 304) {
          var r = new FileReader();
          r.readAsText(xhr.response, code);
          r.onload = function () {
            resource.data = r.result;
            next();
          }
          xhr = undefined;
        } else {
          resource.error = new Error(
            "code:" +
            xhr.status +
            ":资源加载出错！！！网络资源异常！" +
            resource.url +
            "\n"
          );
          next();
        }
      }
    };
    xhr.onerror = function () {
      resource.error = new Error(
        "资源加载出错！！！网络资源异常！" + resource.url + "\n"
      );
      next();
    };
    xhr.send();
  }
}
