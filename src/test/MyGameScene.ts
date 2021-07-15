import { Action, Button, EventManager, GameScene, GameTexture, Label } from "../framework";

export class MyGameScene extends GameScene{
    onInit(){
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