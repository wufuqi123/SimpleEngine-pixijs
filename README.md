# SimpleEngine-pixijs
本项目基于pixi.js(最快的2D H5渲染引擎[API](http://pixijs.download/release/docs/PIXI.Application.html)，[示例](https://pixijs.io/examples/#/demos-basic/container.js))、pixi-spine(pixiJs的spine库[GitHub源码](https://github.com/pixijs/spine)，[API](https://github.com/pixijs/spine/blob/master/examples/index.md))、pixi-particles(pixiJs的粒子库[GitHub源码](https://github.com/pixijs/pixi-particles)，[API](https://pixijs.io/pixi-particles/docs/)，[粒子编辑器](http://106.12.215.217:17000/tools/particleeditor))、pixi-filters(pixiJs的shader特效库[GitHub源码和示例](https://github.com/pixijs/filters))的基础上进行继续封装。



[本项目api](https://www.yuque.com/aah1tv/zbbv26)

[test项目介绍](https://www.yuque.com/aah1tv/yz9ilu/zrlhh2)


## 本项目包含15个模块：

  1.core模块，为framework最为基础的模块。内部实现了基础组件（Component）、游戏app实例(GameApplication)、游戏场景、场景管理、对象池、资源加载。

  2.event模块(事件模块)。EventManager为全局事件的分发和手势操作事件的封装，和资源异常事件的封装。

  3.动画模块。此模块有2个小模块，一为tween的动画组件。二为在tween的基础上做仿cocos的动画组件animation，使用则Component.runAction(Action)。

  4.资源插件模块。此模块作为资源插件的封装，如：做字体加载、csv加载、plist文件加载、粒子加载等等。

  5.计时器模块。此模块为引擎内的计时器，做计时操作。

  6.声音模块。此模块封装了audio标签和WebAudioContext。市面上目前所有js audio库都有严重的内存泄漏问题(包括pixi社区提供的pixi-sound)，只能使用audio标签和WebAudioContext进行封装。

  7.视频模块。此模块封装了video标签，把video流渲染到canvas上。(重要：目前发现x5浏览器内核有部分android手机没有实现video流渲染到canvas上，如要在android使用，不要使用x5浏览器内核！)

  8.粒子模块。此模块在pixi-particles上继续进行封装处理（配合我们自己修改的粒子编辑器）。

  9.filters模块。此模块有一些pixi-filters提供的shader和我们自己封装的shader，如：流光、水波纹等等。

  10.碰撞模块。此模块实现了碰撞的分组和矩形圆多边形之间的碰撞。

  11.屏蔽字模块。此模块实现了对屏蔽字之间的处理。

  12.多线程模块。此模块实现了对WebWorker的封装处理，可以很简单的实现js的多线程。(重要：目前多线程在全局变量里不可初始化Map和Set，只能在run方法之后设置Map和Set。不能在run方法之后调用此类之外的变量方法类等。)

  13.工具模块。此模块实现了CallbackHelper(回调帮助类)、叠加模式、颜色帮助、圆工具、base64工具、路径工具、截屏工具、日期格式化工具、文本工具、js文件加载工具、uuid工具、路径工具、随机数工具、设备信息工具、随机数工具。

  14.GUI层，提供基础的GUI控件。目前已有的控件有：AdapterContainer（list和pager的子条目控件）、BitmapLable、Button、Canvas、CheckBox、Dialog、EditText、Image、Label、Layout、List、MaskProgressBar、MultistateComponent、Pager、Particles、PlaneImage、ProgressBar、Radio、RadioGroup、RadioResist、RichTest、ScrollBar、Scroller、Slider、Spine、SpineNative、Switch、SwitchText、Table、Toast。配合list组件的adapter有：BaseListAdapter、ListAdapter。配合pager的adapter有：PageAdapter、PageClassAdapter。

  15.log模块。


## 使用方式：拉取项目直接使用。

  需要安装node环境。npm i(下载需要的依赖)npm start（运行项目）



### 图片使用

```javascript

        let bg = new Image()
        this.addComponent(bg);
        //type:
        //  json        .json文件  调用getRes时会拿到json文件
        //  res         data数据，原样返回
        //  data        原样返回
        //  plist       .plist文件，会拿到文件的键值对对象
        //  csv         .csv文件，会拿到二维数组
        //  bitmapFont  bitmapFont导出来的文件。加载完成后直接  lable.font = “name”(resinfo设置的name属性)
        //  image       图片文件，会拿到图片数据（如png、jpg等）
        //  font        字体文件。加载完成后直接lable.font = “name”(resinfo设置的name属性)
        //  spine       spine文件，只支持json导出，url为spine的.json文件
        //  audio       音频文件（.mp3等）
        //  video       视频文件（.mp4等）
        //  texture     拿texture（图片不要使用此类型来拿取）
        //  particle    粒子文件（使用魔改后的编辑器来导出粒子）.particle文件

        //魔改后的粒子编辑器地址：http://106.12.215.217:17000/tools/particleeditor
        GameResManager.initResInfo({name:"网络图片",url:"1.jpeg",type:"image"})
        GameResManager.loadGame(["网络图片"],undefined,()=>{
            bg.texture = GameResManager.getRes("网络图片")
        })


```

### button使用

```javascript
        let btn = new Button()
        this.addComponent(btn)
        //可以通过  GameResManager.getRes("网络图片")  赋值
        //GameTexture.WHITE 为一张白色图片
        btn.normalTexture = GameTexture.WHITE
        btn.width = 100
        btn.height = 50
        btn.label = "hide"
        btn.on(EventManager.ALL_CLICK,()=>{
            lable.active = !lable.active
            btn.label = lable.active ? "hide" : "show"
        })
```