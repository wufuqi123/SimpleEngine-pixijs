const File = require("../../server/File.js")["default"];
exports["default"] = class CodeHinting {
    static path = "dev_dist/json.json";
    static avggamePath = "src/avggame/json.json";
    static appPath = "src/dnf/json.json";
    static out() {
        File.readFileStr(CodeHinting.avggamePath, (err, avgData) => {
            avgData = JSON.parse(avgData);
            File.readFileStr(CodeHinting.appPath, (err, appData) => {
                appData = JSON.parse(appData);
                for (let key in appData) {
                    avgData[key] = appData[key];
                }
                File.createFile(CodeHinting.path, JSON.stringify(avgData, "", "\t"), () => {});
            })
        })
    }
}