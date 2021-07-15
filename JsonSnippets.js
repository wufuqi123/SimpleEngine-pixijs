const fs = require('fs')
const os = require('os');

//解析路径，获取用户名
//写入文件
const writeFile = function(content, distPath) {
    fs.writeFileSync(distPath, content)
    console.log('写入文件成功：' + distPath);
}

function main() {
    const distFilePath = os.homedir() + "/AppData/Roaming/Code/User/snippets/json.json";
    let configContentJson;
    // var wshshell = new ActiveXObject("wscript.shell");
    // var localAppData = wshshell.ExpandEnvironmentStrings("%localappdata%");
    console.log('自动配置:', os.homedir())
    fs.readFile("./src/avggame/json.json", "utf-8", function(err, data) {
        let j = JSON.parse(data);
        configContentJson = j;
        fs.readFile("./src/huaping/json.json", "utf-8", function(err, data) {
            let j = JSON.parse(data);
            for (let key in j) {
                configContentJson[key] = j[key];
            }
            writeFile(JSON.stringify(configContentJson, "", "\t"), distFilePath)
            console.log('自动配置vscode snippets成功！')
        });
    });
}

main();