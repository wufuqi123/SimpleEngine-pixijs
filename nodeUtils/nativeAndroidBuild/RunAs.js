// 获取命令行参数
let parm = process.argv.splice(2)

const Bundler = require('parcel-bundler');
const OpenServer = require('../server/OpenServer');
const WriteConfig = require('./assets/WriteConfig');
const File = require("../../server/File.js")["default"];
var processCmd = require('child_process');
const entryFiles = "src/index.html";
let outDir = "./native/dist";
const options = {
    outDir: outDir, // 将生成的文件放入输出目录下，默认为 dist
    outFile: 'index.html', // 输出文件的名称
    publicUrl: './', // 静态资源的 url ，默认为 '/'
    watch: true, // 是否需要监听文件并在发生改变时重新编译它们，默认为 process.env.NODE_ENV !== 'production'
    cache: false, // 启用或禁用缓存，默认为 true
    cacheDir: '.cache', // 存放缓存的目录，默认为 .cache
    // contentHash: false, // 禁止文件名hash
    // global: 'moduleName', // 在当前名字模块以UMD模式导出，默认禁止。
    minify: true, // 压缩文件，当 process.env.NODE_ENV === 'production' 时，会启用
    // scopeHoist: false, // 打开实验性的scope hoisting/tree shaking用来缩小生产环境的包。
    // target: 'browser', // browser/node/electron, 默认为 browser
    // bundleNodeModules: false, // 当package.json的'target'设置'node' or 'electron'时，相应的依赖不会加入bundle中。设置true将被包含。
    // https: { // 设置true自动定义一对密钥和证书，false取消变成http
    //     cert: './ssl/c.crt', // 自定义证书路径
    //     key: './ssl/k.key' // 自定义密钥路径
    // },
    logLevel: 3,
    /**
     * 5 = 储存每个信息
     * 4 = 输出信息、警告和错误附加时间戳和dev服务的http请求
     * 3 = 输出信息、警告和错误
     * 2 = 输出警告和错误
     * 1 = 输出错误
     */
    // hmr: true, // 开启或禁止HRM
    // hmrPort: 1234, // hmr socket 运行的端口，默认为随机空闲端口(在 Node.js 中，0 会被解析为随机空闲端口)
    sourceMaps: true, // 启用或禁用 sourcemaps，默认为启用(在精简版本中不支持)
    // hmrHostname: 'localhost', // 热模块重载的主机名，默认为 ''
    // detailedReport: false // 打印 bundles、资源、文件大小和使用时间的详细报告，默认为 false，只有在禁用监听状态时才打印报告
};
let orientation = 0;
let full_screen = false;
if (parm.includes("--landscape")) {
    orientation = 1
} else if (parm.includes("--portrait")) {
    orientation = 0;
}
if (parm.includes("--full_screen")) {
    full_screen = true;
}




File.delete(outDir);
const bundler = new Bundler(entryFiles, options);
const bundle = bundler.bundle();
bundler.on('buildEnd', () => {
    console.log("正在加开服务")
        //打开服务
    OpenServer.open(1234, true, outDir, (web_url) => {
        console.log("正在写入android")
            //写入andriod  config
        WriteConfig.write({ web_url, full_screen, orientation }, () => {
            console.log("正在打包android")
            processCmd.exec("npm run android:native:runas").on("close", (close) => {
                console.log("开启服务：", web_url);
            }).stdout.on("data", (data) => {
                console.log(data);
            })
        })
    });
});