import { GameScene } from "./GameScene";
import { ClassUtils } from "../utils/ClassUtils";
import { Log } from "../log/Log";
import { GameApplication } from "./GameApplication";
import { EventManager } from "../event/EventManager";

export class SceneManager {
  public currentScene: GameScene | undefined;
  private currentSceneClassName: string | undefined;

  protected static instance: SceneManager;
  static getInstance() {
    if (!this.instance) {
      this.instance = new SceneManager();
      // this.app.
    }
    return this.instance;
  }
  static init(){
    if(!SceneManager.instance){
      SceneManager.getInstance();
    }
  }
  static update(deltaMS: number) {
    SceneManager.instance.update(deltaMS);
  }
  static resize() {
    if (!SceneManager.instance.currentScene) {
      return;
    }
    SceneManager.instance.currentScene.resize();
  }
  update = (deltaMS: number) => {
    if (!this.currentScene) {
      return;
    }
    this.currentScene.update(deltaMS);
  };
  private static classMap: Map<string, any> = new Map();
  // 添加场景
  static add(alias: string, sceneClass: any) {
    SceneManager.classMap.set(alias, sceneClass);
  }

  /**
   * 竖屏状态下  跳转场景
   * @param alias 
   * @param obj 
   */
  static verticalGoTo(alias: string, ...obj: any){
    let isOpen = true;
    let orientationChangeFun = ()=>{
      if(GameApplication.getInstance().currDirection == GameApplication.VERTICAL && isOpen){
        isOpen = false;
        EventManager.off("orientationChange",orientationChangeFun);
        SceneManager.goTo(alias, ...obj);
      }
    }

    EventManager.on("orientationChange",orientationChangeFun);
    orientationChangeFun();
  }

  public static has(alias: string):boolean{
    return SceneManager.classMap.has(alias);
  }
  /**
   * 横屏状态下  跳转场景
   * @param alias 
   * @param obj 
   */
  static landscapeGoTo(alias: string, ...obj: any){
    let isOpen = true;
    let orientationChangeFun = ()=>{
      if(GameApplication.getInstance().currDirection == GameApplication.LANDSCAPE && isOpen){
        isOpen = false;
        EventManager.off("orientationChange",orientationChangeFun);
        SceneManager.goTo(alias, ...obj);
      }
    }

    EventManager.on("orientationChange",orientationChangeFun);
    orientationChangeFun();
  }


  // 跳转场景
  static goTo(alias: string, ...obj: any) {
    let sceneClass = SceneManager.classMap.get(alias);
    if (!sceneClass) {
      throw new Error("没有找到别名为：" + alias + " 的场景");
    }
    this.getInstance().goTo(sceneClass, ...obj);
  }
  protected goTo(sceneClassOrInstance: any, ...obj: any) {
    if (sceneClassOrInstance == undefined || sceneClassOrInstance == null) {
      return;
    }
    let currClassName = ClassUtils.getConstructorName(sceneClassOrInstance);
    // if (this.currentSceneClassName == currClassName) {
    //   return;
    // }
    Log.log(
      "场景跳转,当前场景名：",
      currClassName,
      ",上一个场景名：",
      this.currentSceneClassName
    );
    this.currentSceneClassName = currClassName;
    if (this.currentScene) {
      this.currentScene.destroy();
    }
    this.currentScene = new sceneClassOrInstance();
    if (this.currentScene) {
      (<any>window).app.rootComponent.addChild(this.currentScene.container);
      this.currentScene.init(...obj);
    }
  }
}
