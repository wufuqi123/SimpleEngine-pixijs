const File = require("../../server/File.js")["default"];
let fs = require('fs');
exports["default"] = class StaticPackage {
    static path = "package.json";
    static remove(callback) {
        File.readFileStr(StaticPackage.path, (err, data) => {
            let json = JSON.parse(data);
            delete json.devDependencies["parcel-plugin-static-files-copy"];
            File.createFile(StaticPackage.path, JSON.stringify(json, "", "\t"), () => {
                    callback && callback();
                })
                // console.log(err, data);
        })
    }
    static add(callback) {
        File.readFileStr(StaticPackage.path, (err, data) => {
            let json = JSON.parse(data);
            json.devDependencies["parcel-plugin-static-files-copy"] = "^2.3.1";
            File.createFile(StaticPackage.path, JSON.stringify(json, "", "\t"), () => {
                    callback && callback();
                })
                // console.log(err, data);
        })
    }
    static staticRootPath = "./static";
    static staticOutPaths = ["lib", "indexRes", "login", "sdk"];
    static outPath = "./dev_dist"

    static outStaticFile() {
        let pathArr = File.readDir(StaticPackage.staticRootPath);
        if (!Array.isArray(pathArr)) {
            return;
        }
        pathArr.forEach((path) => {
            if (StaticPackage.staticOutPaths.includes(path)) {
                let srcPath = StaticPackage.staticRootPath + "/" + path;
                let dstPath = StaticPackage.outPath + "/" + path;
                // console.log(srcPath, "---------", dstPath);
                StaticPackage.copy(srcPath, dstPath);
            }
        })
    }

    static copy(srcPath, dstPath) {
        if (!File.exist(srcPath)) {
            return;
        }
        if (File.isDir(srcPath)) {
            File.mkdir(dstPath);
            let pathArr = File.readDir(srcPath);
            pathArr.forEach((path) => {
                StaticPackage.copy(srcPath + "/" + path, dstPath + "/" + path);
            })
        } else {
            // console.log("创建文件", srcPath, dstPath);
            // 创建读取流
            let readable = fs.createReadStream(srcPath);
            // 创建写入流
            let writable = fs.createWriteStream(dstPath);
            readable.pipe(writable);
        }
    }
}