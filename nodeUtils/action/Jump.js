const TextUtils = require("../utils/TextUtils.js");
class Jump {
    use(objMap, nextMap, jsonArr, next) {
        let currFile = objMap.get("file");
        let currChapter = objMap.get("chapter");
        let currAction = objMap.get("action_type");
        let map = {};
        map["file"] = currFile;
        map["chapter"] = currChapter;
        map["action_type"] = currAction;
        if (currAction == "action_jump") {

            let keys = objMap.get("var");
            let vars = objMap.get("content");
            let value = {};
            keys = TextUtils.trim(keys);
            if (keys.indexOf(",") != -1) {
                keys = keys.split(",")
            } else {
                keys = keys.split("，")
            }
            vars = TextUtils.trim(vars);
            if (vars.indexOf(",") != -1) {
                vars = vars.split(",")
            } else {
                vars = vars.split("，")
            }
            for (let i = 0; i < keys.length; i++) {
                map[keys[i]] = vars[i];
            }

            // map["value"] = value;
            jsonArr.push(map);
            next();
        } else {
            next();
        }
    }
}
module.exports = Jump;