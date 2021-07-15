import * as PIXI from "pixi.js";
import "../event/PixijsEvent";
window.PIXI = PIXI;
import "pixi-spine";
import "../res/SpineLoadAtlasParser";

import "../mask/index";
import { Component } from "./Component";
import { SceneManager } from "./SceneManager";
import { ResManager } from "./ResManager";
import { Timer } from "../timer/Timer";

import { TweenManager } from "../tween/TweenManager";
import { FontManager } from "../font/FontManager";
import { VideoManager } from "../video/VideoManager";
import { AudioManager } from "../audio/AudioManager";
import { ParticlesManager } from "../particles/ParticlesManager";
import { DebugComponent } from "../gui/debug/DebugComponent";

import { Log } from "../log/Log";
import { EventManager } from "../event/EventManager";
import { DataManager } from "../data/DataManager";
import { ColliderManager } from "../collider/ColliderManager";
export class GameApplication {
  public application: PIXI.Application;

  private config: any;
  designWidth: number = 0;
  designHeight: number = 0;
  browserHeight: number = 0;
  browserWidth: number = 0;
  ratio: { x: number; y: number } = { x: 1, y: 1 };
  realWidth: number = 0;
  realHeight: number = 0;
  debug: boolean = false;
  //当前方向
  currDirection: number = GameApplication.VERTICAL;
  //横屏
  public static LANDSCAPE: number = 1;
  //竖屏
  public static VERTICAL: number = 2;
  private static _gameSpeed: number = 1;
  static _isPauseGame: boolean = false;
  canvasPosition!: { left: number; top: number; };

  // public static gameSpeed: number = 1;
  /**
   * 设置游戏速度
   */
  public static set gameSpeed(gameSpeed: number) {
    this._gameSpeed = gameSpeed;
  }
  public static get gameSpeed(): number {
    return this._gameSpeed;
  }
  public static isUpdate = false;
  //是否暂停游戏
  // public static isPauseGame = false;
  public static set isPauseGame(isPauseGame: boolean) {
    this._isPauseGame = isPauseGame;
    GameApplication.isPauseGame
      ? AudioManager.globalPause()
      : AudioManager.globalResume();
    GameApplication.isPauseGame
      ? VideoManager.globalPause()
      : VideoManager.globalResume();
  }
  public static get isPauseGame(): boolean {
    return this._isPauseGame;
  }
  protected static instance: GameApplication;
  static getInstance(opts?: any) {
    // console.log("getInstance");
    if (!this.instance) {
      // console.warn("getInstance","进入");
      this.instance = new GameApplication(opts);
    }
    return this.instance;
  }

  constructor(opts?: any) {
    this.application = new PIXI.Application({
      width: opts.width || window.innerWidth,
      height: opts.height || window.innerHeight,
      backgroundColor: opts.stageColor || 0x000000,
      resolution: opts.resolution || window.devicePixelRatio,
      autoDensity: opts.autoDensity || true,
    });

    document.body.appendChild(this.application.view);
    (<any>window).pixiapp = this.application;
    this.initComponent();
    this.onResize();
    ResManager.init();
    // SpineLoadAtlasParser.init();
    ParticlesManager.init();
    AudioManager.init();
    VideoManager.init();
    FontManager.init();
    DataManager.init();
    SceneManager.init();
    ColliderManager.init();
    // PIXI.Ticker.shared.add(ResManager.update);
    // PIXI.Ticker.shared.add(SceneManager.update);
    // PIXI.Ticker.shared.add(TweenManager.tick());
    if (!GameApplication.isUpdate) {
      GameApplication.isUpdate = true;
      // console.log("11111111");
    }
    if (!(<any>window).$__isUpdate) {
      PIXI.Ticker.shared.add(GameApplication.update);
      (<any>window).$__isUpdate = true;
    }

    window.addEventListener("resize", () => {
      this.onResize();
      if (GameApplication.instance.rootComponent) {
        GameApplication.instance.rootComponent.resize();
      }
      SceneManager.resize();
    });
    let self = this;
    var ua = navigator.userAgent.toLowerCase();
    console.log("asdhjkkjashd", ua)
    let isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1
    if (isAndroid) {
      // 安卓　　
      window.onbeforeunload = function () {
        self.destroy();
        return false;
      }
    } else {
      // ios
      window.addEventListener('pagehide', () => {
        self.destroy();
      }, false);
    }
    // this.showFPSFrame();
  }
  static update = () => {
    if (GameApplication.isPauseGame) {
      return;
    }
    let gameSpeed = GameApplication.gameSpeed;
    if (gameSpeed < 0) {
      gameSpeed = 0;
    }
    let dt = PIXI.Ticker.shared.deltaMS * gameSpeed;
    ResManager.update(dt);
    SceneManager.update(dt);
    TweenManager.update(dt);
    ColliderManager.update(dt);
    // TweenManager.tick(dt);
    Timer.update(dt);
    if (GameApplication.instance.rootComponent) {
      GameApplication.instance.rootComponent.update(dt);
    }
  };
  getStage(): PIXI.Container {
    return this.application.stage;
  }
  rootComponent!: Component;
  debugComponent: Component | null = null;
  initComponent() {
    this.rootComponent = new Component();
    this.getStage().addChild(<any>this.rootComponent);
  }
  showFPSFrame() {
    if (this.debugComponent) {
      return;
    }
    this.debugComponent = new DebugComponent();
    this.debugComponent.zIndex = 100000;
    this.rootComponent.addChild(this.debugComponent);
    this.debugComponent.paddingScreenBottom(0);
    this.debugComponent.paddingScreenLeft(0);
  }
  hideFPSFrame() {
    if (this.debugComponent) {
      this.rootComponent.removeChild(<any>this.debugComponent);
    }
    this.debugComponent = null;
  }
  /**
   *
   * @param config {
   *  designWidth :       设计分辨率宽度
   *  designHeight :       设计分辨率高度
   *  adaptiveMode :      适配方式：{0：不适配，1：根据宽度适配，2：根据高度适配，3：根据宽度高度一起适配，4：手机根据宽度适配，pad电脑根据高度适配}
   *  canvasDebug :  可以调用画布的  放大缩小  window.lessen(10)   window.restore()
   *  configDebug :  获取配置数据  window.getConfig()   window.getGlobalConfig()
   * }
   */
  static setConfig(config?: {
    designWidth: number;
    designHeight: number;
    adaptiveMode: number;
    ratio?: number;
    stageColor?: number;
    debug?: boolean;
    backgroundImage?: string;
    dialogDebug?: boolean;
    jumpDialogDebug?: boolean;
    fpsDebug?: boolean;
    jsonPackageDebug?: boolean;
    logDebug?: boolean;
    phoneConsole?: boolean;
    configDebugDialog?: boolean;
    configDebug?: boolean;
    canvasDebug?: boolean;
  }) {
    GameApplication.getInstance({
      width: config?.designWidth,
      height: config?.designHeight,
      stageColor: config?.stageColor,
    }).config = config;
    (<any>window).app = GameApplication.getInstance();
    GameApplication.getInstance().onResize();
    if (config) {
      //使用log
      if (config.debug && config.fpsDebug) {
        GameApplication.getInstance().debug = config.debug;
        GameApplication.getInstance().showFPSFrame();
      }
      if (config.backgroundImage) {
        GameApplication.getInstance().setBackgroundImage(
          config.backgroundImage
        );
      }
      if (config.debug && config.canvasDebug) {
        GameApplication.getInstance().initCanvasDebug();
      }

      Log.init(config.debug && config.logDebug);
    }
  }
  static getConfig(): {
    designWidth: number;
    designHeight: number;
    adaptiveMode: number;
    ratio?: number;
    debug?: boolean;
    dialogDebug?: boolean;
    jumpDialogDebug?: boolean;
    fpsDebug?: boolean;
    jsonPackageDebug?: boolean;
    logDebug?: boolean;
    phoneConsole?: boolean;
    configDebugDialog?: boolean;
    canvasDebug?: boolean;
  } {
    return GameApplication.getInstance().config;
  }
  static getDeviceInfo(): { width: number; height: number } {
    let application = GameApplication.getInstance();
    return {
      width: application.realWidth,
      height: application.realHeight,
    };
  }
  static getDesignWidth(): number {
    let config = GameApplication.getConfig();
    return config.designWidth;
  }
  static getDesignHeight(): number {
    let config = GameApplication.getConfig();
    return config.designHeight;
  }
  static getSceneWidth(): number {
    let deviceInfo = GameApplication.getDeviceInfo();
    let config = GameApplication.getConfig();
    return Math.min(deviceInfo.width, config.designWidth);
  }
  static getSceneHeight(): number {
    let deviceInfo = GameApplication.getDeviceInfo();
    let config = GameApplication.getConfig();
    return Math.min(deviceInfo.height, config.designHeight);
  }
  private backgroundImage!: HTMLImageElement;
  private backgroundImageDiv!: HTMLDivElement;


  initCanvasDebug() {
    /**
     * 画布缩小  倍数
     */
    let multiple = 1;
    (<any>window).lessen = (m: number = 10) => {
      if (typeof m !== "number") {
        console.error(`缩小时不能写不是数字的倍数`);
      }
      multiple = m;
      let designHeight = GameApplication.getDesignHeight();
      let designWidth = GameApplication.getDesignWidth();
      let rootComponent = GameApplication.getInstance().rootComponent;
      rootComponent.x = (designWidth - designWidth / m) / 2;
      rootComponent.y = (designHeight - designHeight / m) / 2;
      rootComponent.scale.set(1 / m);
    }


    /**
     * 画布还原
     */
    (<any>window).restore = () => {
      (<any>window).lessen(1);
    }
  }


  setBackgroundImage(url: string) {
    if (!this.backgroundImageDiv) {
      this.backgroundImageDiv = document.createElement("div");
      this.backgroundImageDiv.style.zIndex = "-9999";
      this.backgroundImageDiv.style.position = "fixed";
      document.body.insertBefore(
        this.backgroundImageDiv,
        document.body.firstChild
      );
    }
    if (!this.backgroundImage) {
      this.backgroundImage = <HTMLImageElement>document.createElement("img");
      this.backgroundImageDiv.appendChild(this.backgroundImage);
    }
    this.backgroundImage.src = url;
    this.backgroundImage.onload = () => {
      this.resetBackgroundImageSize();
    };
  }
  resetBackgroundImageSize() {
    if (!this.backgroundImageDiv || !this.backgroundImage) return;
    this.backgroundImageDiv.style.top =
      document.documentElement.clientHeight / 2 + "px";
    this.backgroundImageDiv.style.left =
      document.documentElement.clientWidth / 2 + "px";

    let left = -this.backgroundImage.width / 2;
    let top = -this.backgroundImage.height / 2;

    this.backgroundImage.style.marginLeft = left + "px";
    this.backgroundImage.style.marginTop = top + "px";
    this.backgroundImage.style.transform = `scale(${this.ratio.x},${this.ratio.y})`;
  }
  onResize = () => {
    if (!this.config) return;
    let browserWidth = document.documentElement.clientWidth;
    let browserHeight = document.documentElement.clientHeight;
    // if(this.browserHeight-browserHeight>140){
    //   return;
    // }

    const designWidth = this.config.designWidth;
    const designHeight = this.config.designHeight;

    // const adaptiveMode = this.config.adaptiveMode;
    // adaptiveMode {0：不适配，1：根据宽度适配，2：根据高度适配，3：根据宽度高度一起适配，4：手机根据宽度适配，pad电脑根据高度适配}
    let adaptiveMode = this.config.adaptiveMode;
    if (adaptiveMode == 4) {
      if (PIXI.utils.isMobile.phone) {
        //宽适配
        adaptiveMode = 1;
      } else {
        //高适配
        adaptiveMode = 2;
      }
    } else if (adaptiveMode == 5) {
      // 当前大于比例 高适配 ==
      let w = browserWidth;
      let h = browserHeight;
      let ratio = 1;
      if (!isNaN(this.config.ratio)) {
        ratio = this.config.ratio;
      }
      Log.info("ratio", ratio);
      if (w / h < ratio) {
        //宽适配
        adaptiveMode = 1;
        Log.info("宽匹配！");
      } else {
        //高适配
        adaptiveMode = 2;
        Log.info("高匹配！");
      }
    }
    //重置WebGL状态
    this.application.renderer.reset();

    //按照高适配！
    let ratio = {
      x: 1,
      y: 1,
    };
    let left = 0;
    let top = 0;
    //真实高度  像素
    let realPixelHeight = browserHeight;
    let realPixelWidth = browserWidth;
    switch (adaptiveMode) {
      case 1:
        //宽适配
        // 比例  浏览器的宽/设计分辨率的宽
        ratio.x = browserWidth / designWidth;
        ratio.y = ratio.x;
        //真实webgl真实宽  = 浏览器宽
        realPixelWidth = browserWidth;
        //真实宽 = 浏览器宽度和 设计分辨率下的像素  取最小
        realPixelHeight = Math.min(browserHeight, designHeight * ratio.y);
        break;
      case 2:
        //高适配
        // 比例  浏览器的高/设计分辨率的高
        ratio.y = browserHeight / designHeight;
        ratio.x = ratio.y;
        //真实webgl真实高  = 浏览器高
        realPixelHeight = browserHeight;
        //真实宽 = 浏览器宽度和 设计分辨率下的像素  取最小
        realPixelWidth = Math.min(browserWidth, designWidth * ratio.x);
        break;
      case 3:
        //根据宽度高度一起适配
        // 比例  浏览器的高/设计分辨率的高
        ratio.y = browserHeight / designHeight;
        ratio.x = browserWidth / designWidth;
        //真实webgl真实高  = 浏览器高
        realPixelHeight = Math.min(browserHeight, designHeight * ratio.y);
        //真实宽 = 浏览器宽度和 设计分辨率下的像素  取最小
        realPixelWidth = Math.min(browserWidth, designWidth * ratio.x);
        break;
    }

    if (browserWidth > realPixelWidth) {
      left = (browserWidth - realPixelWidth) / 2;
    }
    if (browserHeight > realPixelHeight) {
      top = (browserHeight - realPixelHeight) / 2;
    }
    // 真实的宽  设计分辨率
    this.realWidth = realPixelWidth / ratio.x;
    this.realHeight = realPixelHeight / ratio.x;
    //设计分辨率
    this.designWidth = designWidth;
    this.designHeight = designHeight;

    this.browserWidth = browserWidth;
    this.browserHeight = browserHeight;

    this.ratio = ratio;

    // 调整WEbGL窗口到 指定大小 (浏览器宽高)
    this.application.renderer.resize(realPixelWidth, realPixelHeight);
    this.application.stage.scale.set(ratio.x, ratio.y);
    this.application.renderer.view.style.marginLeft = left + "px";
    this.application.renderer.view.style.marginTop = top + "px";
    this.canvasPosition = {
      left,
      top,
    }


    if (GameApplication.instance.rootComponent) {
      GameApplication.instance.rootComponent.resize();
    }
    // 检测手机横竖屏
    if (PIXI.utils.isMobile.phone) {
      let isSendOrientationchange = false;
      let orientation = GameApplication.VERTICAL;
      if (
        document.documentElement.clientWidth >
        document.documentElement.clientHeight
      ) {
        orientation = GameApplication.LANDSCAPE;
      }
      if (this.currDirection != orientation) {
        isSendOrientationchange = true;
      }
      this.currDirection = orientation;
      if (isSendOrientationchange) {
        EventManager.emit("orientationChange", orientation);
      }
    }
    this.resetBackgroundImageSize();
  };

  destroy() {
    // this.instance = undefined;
    this.application.destroy(true, { children: true, texture: true, baseTexture: true });
    (<any>GameApplication).instance = undefined;
    ResManager.removeAllResources();
    AudioManager.destroyAll();
  }
}
