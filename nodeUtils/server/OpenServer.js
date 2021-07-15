var exec = require('child_process').exec;
const net = require('net');
const os = require('os');
/**
 * 打开浏览器
 * @param {*} port 
 * @param {*} openchrome 
 */
module.exports.open = async(port = 1234, openchrome = false, serverDir = "dist", callback) => {
    port = await tryUsePort(port);
    let localhost = getIPAdress();
    let url = `http://${localhost}:${port}/index.html`

    exec(`http-server ${serverDir} -e -p ${port} -c-1`, (error) => {
        if (error) {
            console.error('error: ' + error);
            return;
        }
    });
    if (openchrome) {
        exec(`start chrome ${url}`, () => {

        });
    }
    callback && callback(url);

}


///获取本机ip///
function getIPAdress() {
    var interfaces = os.networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}
/**
 * 检测端口是否被占用，并返回一个没有占用的端口
 * @param {*} port 
 */
function portInUse(port) {
    return new Promise((resolve, reject) => {
        let server = net.createServer().listen(port);
        server.on('listening', function() {
            server.close();
            resolve(port);
        });
        server.on('error', function(err) {
            if (err.code == 'EADDRINUSE') {
                port++;
                resolve(portInUse(port));
            }
        });
    });
}

/**
 * 返回一个  没有被占用的端口
 * @param {*} port 
 */
const tryUsePort = async function(port) {
    return await portInUse(port);
}