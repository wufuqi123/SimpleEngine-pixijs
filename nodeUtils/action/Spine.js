class Spine {
    use(objMap, nextMap, jsonArr, next) {
        let currFile = objMap.get("file");
        let currChapter = objMap.get("chapter");
        let currAction = objMap.get("action_type");
        let spineMap = {};
        spineMap["file"] = currFile;
        spineMap["chapter"] = currChapter;
        spineMap["action_type"] = currAction;
        if (currAction == "action_spine") {
            console.log("解析到  spine", objMap);
            spineMap["name"] = "set";
            spineMap["action"] = objMap.get("action");
            spineMap["nick"] = objMap.get("nickname");
            spineMap["res"] = objMap.get("res");
            spineMap["opacity"] = 0;
            let position = objMap.get("position");
            let parr;
            if (typeof(position) == "string") {
                if (position.indexOf(",") != -1) {
                    parr = position.split(",")
                } else {
                    parr = position.split("，")
                }
                spineMap["position"] = parr;
            }
            jsonArr.push(spineMap);
            next();
        } else {
            next();
        }
    }
}
module.exports = Spine;