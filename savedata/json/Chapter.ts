import File from "../../server/File";
var TextUtils = require("../../nodeUtils/utils/TextUtils");

export default class Chapter {
  static path= "./static/resources/chapter/section/index.json";
  static count= 0;
  static index= 0;
  static callback:Function;
  public static parse(obj:any,callback:Function){
    this.count = 0;
    this.index = 0;
    this.callback =callback;
    File.readFileStr(this.path, (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      if (TextUtils.isEmpty(data)) {
        console.log("读取sectionConfig失败，data为空，空文件！");
        return;
      }
      let json = JSON.parse(data);
      obj["resources/chapter/section/index.json"] = json;
      let sectionFiles = json.sectionFiles;
      if(Array.isArray(sectionFiles)){
        let index = 0;
        let jsonFlieArr = new Array();
        sectionFiles.forEach((v)=>{
          File.readFileStr("./static/resources/chapter/section/"+v+".json", (err, sectionArr) => {
            sectionArr = JSON.parse(sectionArr);
            obj["resources/chapter/section/"+v+".json"] = sectionArr;
            if(Array.isArray(sectionArr)){
             
              sectionArr.forEach(s=>{
                if(!jsonFlieArr.includes(s)){
                  jsonFlieArr.push(s);
                }
              });
            }
            index ++;
            if(index == sectionFiles.length){
              let dir = "./static/resources/chapter/";
              this.count = jsonFlieArr.length;
              jsonFlieArr.forEach((element) => {
                console.log("dhjaskdjlaks",element);
                let file = dir + element + ".json";
                File.readFileStr(file, (err, data) => {
                  this.index++;
                  if (err) {
                    console.log(err);
                    return;
                  }
                  if (TextUtils.isEmpty(data)) {
                    console.log("读取" + file + "失败，data为空，空文件！");
                    this.load();
                    return;
                  }
                  data = JSON.parse(data);
                  obj["resources/chapter/"+element+".json"] = data;
                  this.load();
                });
              });
            }
          });
        })
      }

      
    });
  }
  static load(){
    if (this.count == this.index) {
      this.callback && this.callback();
    }
  }
}