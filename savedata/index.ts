import File from "../server/File";
import Chapter from "./json/Chapter";
import Json from "./json/Json";
import ResJson from "./json/ResJson";

let outPath = "./static/lib/outjson";
let outPathDist = "./dist/lib/outjson";
let outFile = "json.json";
let json = {};
Json.parse(json, () => {
  Chapter.parse(json, ()=>{
    ResJson.parse(json,succeed);
  });
});

function succeed() {
  // console.log(json);
  if (!File.exist(outPath)) {
    File.mkdir(outPath);
  }
  let str = JSON.stringify(json);
  File.createFile(outPath + "/" + outFile, str, () => {});
  File.deleteJsFile("./savedata");
  setTimeout(() => {
    File.createFile(outPathDist + "/" + outFile, str, () => {});
    console.log("结束。。。。")
  }, 1000);
}
