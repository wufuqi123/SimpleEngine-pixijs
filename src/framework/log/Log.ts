/**
 * log
 */
export class Log {
  public static isPrint: boolean = false;
  public static log:Function = console.log;
  public static info:Function = console.info;
  public static debug:Function = console.debug;
  public static warn:Function = console.warn;
  public static error:Function = console.error;
  public static clear:Function = console.clear;
  public static init(isPrint: boolean = false) {
    Log.isPrint = isPrint;
    if(isPrint){
      Log.log = console.log;
      Log.info = console.info;
      Log.debug = console.debug;
      Log.warn = console.warn;
      Log.error = console.error;
    }else{
      Log.log = Log.emptyFunction;
      Log.info = Log.emptyFunction;
      Log.debug = Log.emptyFunction;
      Log.warn = Log.emptyFunction;
      Log.error = Log.emptyFunction;
      Log.clear();
    }

  }
  public static emptyFunction(){

  }
}
