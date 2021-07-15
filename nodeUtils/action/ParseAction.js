const xlsx = require("node-xlsx");
const TextUtils = require("../utils/TextUtils.js");
const electron = require('electron')
const app = electron.app
const dialog = electron.dialog
let fs = require('fs');


class ParseAction {
    actionObject = new Array();
    activeArray = new Array();
    jsonArr = new Array();
    nextIndex = 0;
    parseIndex = 0;
    path = "";
    parse(path) {
        this.path = path;
        let sheetList = xlsx.parse(path);
        let currFile = "";
        let currChapter = "";
        let currAction = "";
        let keyIndexMap = new Map();

        sheetList.forEach((sheet) => {
            sheet.data.forEach((row, rowIndex) => {
                let actionMap = new Map();
                row.forEach((cell, index) => {
                    if (rowIndex == 0) {
                        let keys = cell.split("/");
                        keyIndexMap.set(index, keys);
                    } else {
                        let keys = keyIndexMap.get(index);
                        if (keys == undefined || keys == null) {
                            return;
                        }
                        keys.forEach((key) => {
                            key = TextUtils.trim(key);
                            if (TextUtils.isEmpty(key)) {
                                return;
                            }
                            if (key == "file") {
                                currFile = cell;
                            } else if (key == "chapter") {
                                currChapter = cell;
                            } else if (key == "action_type") {
                                currAction = cell;
                            }
                            actionMap.set(key, cell);
                        });
                    }
                });
                if (!actionMap.has("file")) {
                    actionMap.set("file", currFile);
                }
                if (!actionMap.has("chapter")) {
                    actionMap.set("chapter", currChapter);
                }
                if (!actionMap.has("action_type")) {
                    actionMap.set("action_type", currChapter);
                }
                this.activeArray.push(actionMap);
            });
        });
        // console.log(this.activeArray);
        this.parseIndex = 0;
        this.nextIndex = 0;
        this.parseAction();
    }
    use(obj) {
        this.actionObject.push(obj);
    }

    parseAction() {
        let currActionMap = this.activeArray[this.parseIndex];
        let nextActionMap = this.activeArray[this.parseIndex + 1];
        this.actionObject.forEach((object) => {
            object.use(currActionMap, nextActionMap, this.jsonArr, this.next.bind(this));
        })
    }
    next() {
        this.nextIndex++;
        if (this.nextIndex == this.actionObject.length) {
            this.nextIndex = 0;
            this.parseIndex++;
            if (this.parseIndex == this.activeArray.length) {
                console.log(this.jsonArr)
                    //解析完成
                app.on("ready", () => {
                    this.createActionJson();
                })
            } else {
                this.nextIndex = 0;
                this.parseAction();
            }
        }
    }
    createActionJson() {
        let outPath = this.path.substring(0, this.path.lastIndexOf("/"));
        let jsonMap = {};
        this.jsonArr.forEach((v) => {
            let chapterMap = jsonMap[v.file];
            if (!chapterMap) {
                chapterMap = {};
                jsonMap[v.file] = chapterMap;
            }
            let actionArr = chapterMap[v.chapter];
            if (!Array.isArray(actionArr)) {
                actionArr = [];
                chapterMap[v.chapter] = actionArr;
            }
            let action = {};
            action[v.action_type] = v;
            delete v["file"];
            delete v["chapter"];
            delete v["action_type"];
            actionArr.push(action)
        });
        let index = 0;
        for (let k in jsonMap) {
            index++;
            let v = jsonMap[k];
            fs.exists(outPath + "/" + k + ".json", function(exists) {
                if (exists) {
                    let index = dialog.showMessageBoxSync({
                        title: '错误',
                        type: 'error',
                        message: '当前文件已存在【' + k + ".json】是否覆盖？",
                        buttons: ["确定", "取消"]
                    })
                    if (index == 0) {
                        let str = JSON.stringify(v, "", "\t")
                        fs.writeFile(outPath + "/" + k + ".json", str, function(err) {
                            if (err) { res.status(500).send('Server is error...') }
                        })
                    }
                } else {
                    let str = JSON.stringify(v, "", "\t")
                    fs.writeFile(outPath + "/" + k + ".json", str, function(err) {
                        if (err) { res.status(500).send('Server is error...') }
                    })
                }
            })
        }
        app.quit();
    }
};

module.exports = ParseAction;