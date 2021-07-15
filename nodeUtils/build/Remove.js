const File = require("../../server/File.js")["default"];
let path = "./dev_dist";
let noRemoveArr = [".git", "resources", ".gitignore", ".gitmodules", "更改代码提示.bat", "addSubmodule.bat"];
let pathArr = File.readDir(path);
pathArr.forEach((v) => {
    if (!noRemoveArr.includes(v)) {
        File.delete(path + "/" + v);
    }
})