import File from "../../server/File";
var TextUtils = require("../../nodeUtils/utils/TextUtils");

export default class ResJson {
    static rootDir = "./static/";
  static paths= ["resources/default.lib.json","lib/default.lib.json"];
  static index= 0;
  static callback:Function;
  static obj:any;
  static loadFile:Array<string> = new Array();

  
  public static parse(obj:any,callback:Function){
    this.loadFile.length = 0;
    this.index = 0;
    this.obj = obj;
    this.callback =callback;
    let index = 0;
    this.paths.forEach(path=>{
        File.readFileStr(ResJson.rootDir+path, (err, data) => {
            if (err) {
              console.log(err);
              return;
            }
            if (TextUtils.isEmpty(data)) {
              console.log("读取sectionConfig失败，data为空，空文件！");
              return;
            }
            let dir = path.substring(0, path.lastIndexOf("/") + 1);
            let json = JSON.parse(data);
            for(let key in json){
                let data = json[key];
                if(data.type == "res"){
                    ResJson.loadFile.push(dir+data.url);
                }
            }
            index++;
            if(index==this.paths.length){
                ResJson.loadRes();
            }
          });
    });
  }

  static loadRes(){
    ResJson.load();
    ResJson.loadFile.forEach(path=>{
        File.readFileStr(ResJson.rootDir+path, (err, data) => {
            if (err) {
              console.log(err);
              return;
            }
            if (TextUtils.isEmpty(data)) {
              console.log("读取sectionConfig失败，data为空，空文件！");
              return;
            }
            this.index++;
            this.obj[path] = JSON.parse(data);
            ResJson.load();
        });
    })
  }

  static load(){
    if (this.loadFile.length == this.index) {
      this.callback && this.callback();
    }
  }
}