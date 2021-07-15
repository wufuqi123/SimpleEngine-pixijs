const xlsx = require("node-xlsx");
const TextUtils = require("../utils/TextUtils.js");
const electron = require('electron')
const app = electron.app
const dialog = electron.dialog
let fs = require('fs');


class ParseRes {
    path = "";
    resArr = new Array();
    parse(path) {
        this.path = path;
        let sheetList = xlsx.parse(path);
        let keyIndexMap = new Map();
        sheetList.forEach((sheet) => {
            sheet.data.forEach((row, rowIndex) => {
                let actionMap = {};
                row.forEach((cell, index) => {
                    if (rowIndex == 0) {
                        keyIndexMap.set(index, cell);
                    } else {
                        let key = keyIndexMap.get(index);
                        if (TextUtils.isEmpty(key)) {
                            return;
                        }
                        actionMap[key] = cell;
                    }
                });
                if (rowIndex != 0 && actionMap.name != undefined) {
                    this.resArr.push(actionMap);
                }
            });
        });

        this.createJson();
    }
    createJson() {
        console.log(this.resArr)
        let groups = {};
        let resources = {};
        let repetition = [];
        this.resArr.forEach((v) => {
            let currName = undefined;
            let currUrl = "";
            let currType = "";
            let currGroupName = [];
            for (let key in v) {
                let value = v[key];
                // v.forEach((key, value) => {
                if (key == "name") {
                    currName = value;
                } else if (key == "url") {
                    currUrl = value;
                } else if (key == "type") {
                    currType = value;
                } else {
                    currGroupName.push(key);
                }
            };
            if (!currName) {
                return;
            }
            console.log(currName)
            if (resources[currName] && repetition.indexOf(currName) == -1) {
                repetition.push(currName);
            }
            resources[currName] = { url: currUrl, type: currType };
            currGroupName.forEach((groupName) => {
                let groupArr = groups[groupName];
                if (!Array.isArray(groupArr)) {
                    groupArr = [];
                    groups[groupName] = groupArr;
                }
                if (groupArr.indexOf(currName) == -1) {
                    groupArr.push(currName);
                }
            })
        })
        let json = { groups, resources };
        let outPath = this.path.substring(0, this.path.lastIndexOf(".") + 1) + "json";
        json = JSON.stringify(json, "", "\t")
        fs.writeFile(outPath, json, function(err) {
            if (err) { res.status(500).send('Server is error...') }
        })
        app.on("ready", () => {
            dialog.showMessageBoxSync({
                title: '警告',
                type: 'error',
                message: '当前资源有重复名称：' + repetition.toString(),
                buttons: ["确定"]
            });

        })
        app.quit();
        console.log(repetition);
    }
}

module.exports = ParseRes;