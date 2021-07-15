import { Action, Button, EventManager, GameScene, GameTexture, Label,Image, ResManager, GameResManager } from "../framework";

export class MyGameScene extends GameScene{
    onInit(){

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

        let btn = new Button()
        this.addComponent(btn)
        btn.normalTexture = GameTexture.WHITE
        btn.width = 100
        btn.height = 50
        btn.label = "hide"

        let aminBtn = new Button()
        this.addComponent(aminBtn)
        aminBtn.normalTexture = GameTexture.WHITE
        aminBtn.width = 100
        aminBtn.height = 50
        aminBtn.label = "move"

        let lable = new Label()
        this.addComponent(lable)
        lable.text = "hello word"

        lable.x = this.sceneWidth * 0.5
        lable.y = this.sceneHeight * 0.5 - 40
        lable.anchor.x = 0.5
        lable.anchor.y = 1

        btn.x = this.sceneWidth * 0.5
        btn.y = this.sceneHeight * 0.5 + 40
        btn.anchor.set(0.5,0)

        aminBtn.x = this.sceneWidth * 0.5
        aminBtn.y = this.sceneHeight * 0.5 + 120
        aminBtn.anchor.set(0.5,0)


        // lable.active = false
        btn.on(EventManager.ALL_CLICK,()=>{
            lable.active = !lable.active
            btn.label = lable.active ? "hide" : "show"
        })

        aminBtn.on(EventManager.ALL_CLICK,()=>{
            lable.stopAction()
            lable.x = this.sceneWidth * 0.5
            lable.runAction(Action.moveBy(200,100,0))
        })

    }
}