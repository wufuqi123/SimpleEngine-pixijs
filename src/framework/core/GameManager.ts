import { GameApplication } from "./GameApplication";

export class GameManager {
  /**
   * 更改游戏进度
   */
  public static set gameSpeed(gameSpeed:number){
    GameApplication.gameSpeed = gameSpeed;
  }
  public static get gameSpeed():number{
    return GameApplication.gameSpeed;
  }


  public static pauseGame() {
    GameApplication.isPauseGame = true;
  }

  /**
   * 恢复游戏进度
   */
  public static resumeGame() {
    GameApplication.isPauseGame = false;
  }

}