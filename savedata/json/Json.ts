import File from "../../server/File";
import { parse as csvParse  } from "papaparse";
var TextUtils = require("../../nodeUtils/utils/TextUtils");
export default class Json {
  static pathArr= [
    "resources/config.json",
    "resources/formulaConfig.json",
    "resources/globalConfig.json",
    "resources/chapterConfig.json",
    "resources/default.res.json",
    "resources/system.json",
    "resources/goods.json",
    "resources/gifts.json",
    "resources/chat/chat.csv",
  ];
  static count= 0;
  static index= 0;
  static callback:Function;
  public static parse(obj:any,callback:Function){
    this.count = this.pathArr.length;
    this.callback =callback;
    this.pathArr.forEach(path=>{
      let pathStrArr = path.split(".");
      let suffix = pathStrArr[pathStrArr.length-1] ;
      let code = "utf8";
      if(suffix == "csv"){
        code = "GB2312";
      }

      File.readFileStr("./static/"+path,(err,data)=>{
        if (err) {
          console.log(err);
          return;
        }
        this.index ++;
        if (TextUtils.isEmpty(data)) {
          console.log("读取" + path + "失败，data为空，空文件！");
          this.load();
          return;
        }
        if(suffix== "json"){
          data = JSON.parse(data);
        }else if(suffix == "csv"){
          let csvData = csvParse(data);
          if(csvData && Array.isArray(csvData.data)){
            data = csvData.data;
          }
        }
        
        obj[path] = data;
        this.load();
      },code);
    })
  }
  static load(){
    if (this.count == this.index) {
      this.callback && this.callback();
    }
  }
}