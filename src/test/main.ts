import { GameApplication, SceneManager } from "../framework";
import { MyGameScene } from "./MyGameScene";

GameApplication.setConfig({
  designHeight:500,
  designWidth:500,
  stageColor:0xff0000,
  adaptiveMode:2
})
SceneManager.add("MyGameScene",MyGameScene)
SceneManager.goTo("MyGameScene")