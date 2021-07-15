const TextUtils = require("../utils/TextUtils.js");
class MainDialog {
    use(objMap, nextMap, jsonArr, next) {
        let currFile = objMap.get("file");
        let currChapter = objMap.get("chapter");
        let currAction = objMap.get("action_type");
        let expire = objMap.get("expire");
        let dialogMap = {};
        dialogMap["file"] = currFile;
        dialogMap["chapter"] = currChapter;
        dialogMap["action_type"] = currAction;
        dialogMap["expire"] = true;
        if (expire == false) {
            dialogMap["expire"] = false;
        }

        console.log(currAction, objMap, nextMap);

        if (currAction == "action_subDialog") {
            let content = objMap.get("content");
            dialogMap["text"] = content;
            jsonArr.push(dialogMap);
            next();
        } else if (currAction == "action_floatDialog") {
            dialogMap["text"] = objMap.get("content");
            dialogMap["nick"] = objMap.get("nickname");
            dialogMap["configId"] = objMap.get("color_type");
            let position = objMap.get("position");
            let parr;
            if (typeof(position) == "string") {
                if (position.indexOf(",") != -1) {
                    parr = position.split(",")
                } else {
                    parr = position.split("，")
                }
                dialogMap["position"] = parr;
            }
            jsonArr.push(dialogMap);
            next();
        } else if (currAction == "action_mainDialog") {
            dialogMap["text"] = objMap.get("content");
            dialogMap["res"] = objMap.get("res");
            dialogMap["action"] = objMap.get("action");
            jsonArr.push(dialogMap);
            next();
        } else if (currAction == "action_hideDialog") {
            let nickname = objMap.get("nickname");
            if ("sub" == nickname) {
                dialogMap["remove"] = true;
                dialogMap["action_type"] = "action_subDialog";
                jsonArr.push(dialogMap);
            } else if ("mian" == nickname) {
                dialogMap["remove"] = true;
                dialogMap["action_type"] = "action_mainDialog";
                jsonArr.push(dialogMap);
            } else {
                nickname = TextUtils.trim(nickname);
                let nickArr;
                if (nickname.indexOf(",") != -1) {
                    nickArr = nickname.split(",")
                } else {
                    nickArr = nickname.split("，")
                }
                dialogMap["remove"] = nickArr;
                dialogMap["action_type"] = "action_floatDialog";
                jsonArr.push(dialogMap);
            }
            next();
        } else {
            next();
        }
    }
}
module.exports = MainDialog;