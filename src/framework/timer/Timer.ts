import { Log } from "../log/Log";
import { UUIDUtils } from "../utils/UUIDUtils";
export class Timer {
  private static timerMap: Map<
    string,
    {
      name: string;
      id: string;
      currTime: number;
      fun: Function;
      totalTime: number;
      isLoop: boolean;
      isEnd: boolean;
    }
  > = new Map();
  private static timerArr: Array<{
    name: string;
    id: string;
    currTime: number;
    fun: Function;
    totalTime: number;
    isLoop: boolean;
    isEnd: boolean;
  }> = new Array();
  public static setTimeout(fun: Function, time: number): string | undefined {
    return Timer.setTimer(fun, time, false, "setTimeout");
  }
  public static requestAnimFrame(fun: Function): string | undefined {
    return Timer.setTimer(fun, 0, false, "requestAnimFrame");
  }
  public static setInterval(fun: Function, time: number): string | undefined {
    return Timer.setTimer(fun, time, true, "setInterval");
  }
  private static setTimer(
    fun: Function,
    time: number,
    isLoop: boolean,
    name: string
  ): string | undefined {
    if (!fun) {
      return;
    }
    if (isNaN(time)) {
      time = 0;
      Log.warn("执行【" + name + "】时time不为number，已默认当作0来处理！");
    }
    let id = UUIDUtils.getUUID();
    let timerObj = {
      name,
      id,
      currTime: 0,
      fun,
      totalTime: time,
      isLoop,
      isEnd: false,
    };
    Timer.timerMap.set(id, timerObj);
    Timer.timerArr.push(timerObj);
    return id;
  }
  public static clearTimer(id: string | undefined) {
    if (id == undefined) {
      return;
    }
    let timerObj = Timer.timerMap.get(id);
    if (!timerObj) {
      return;
    }
    Timer.timerArr.remove(timerObj);
    timerObj.isEnd = true;
    Timer.timerMap.delete(id);
  }
  public static update(dt: number) {
    for (let i = 0; i < Timer.timerArr.length; i++) {
      let timer = Timer.timerArr[i];
      if (timer.isEnd) {
        Timer.clearTimer(timer.id);
        i--;
        continue;
      }
      timer.currTime += dt;
      // ht.log("execute",timer.currTime,timer.totalTime)
      if (timer.currTime >= timer.totalTime) {
        // ht.warn(timer.name,timer)
        if (!timer.isLoop) {
          Timer.clearTimer(timer.id);
        }
        timer.fun && timer.fun(dt);
        timer.currTime -= timer.totalTime;
      }
    }
  }
}
