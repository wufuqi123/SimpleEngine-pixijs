const File = require("../../../server/File.js")["default"];
const configDir = "./native/android/app/src/main/assets/"
const configFileName = "config.properties";
module.exports.write = (configs, callback) => {
    let str = "";
    for (let key in configs) {
        str += key + "=" + configs[key]
        str += "\n";
    }
    File.createFile(configDir + configFileName, str, () => {
        callback && callback();
    })

}