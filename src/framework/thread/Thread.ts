import { EventEmitter } from "eventemitter3";

function outObjStrJs(obj: Object): string {
  if (typeof obj == "function") {
    return (<any>obj).toString() + ".bind(this)";
  }
  let str = "";
  if (typeof obj == "string") {
    return '"' + obj + '"';
  } if (typeof obj == "number" || typeof obj == "boolean") {
    return obj + "";
  } if (obj instanceof Array) {
    str = "[";
    obj.forEach((v, i) => {
      str += (i == 0 ? "" : ",") + outObjStrJs(v)
    })
    str += "]";
  } else {
    str = "{";
    for (let key in obj) {
      str += outObjStrJs(key) + ":" + outObjStrJs((<any>obj)[key])+",";
    }
    str += "}";
  }
  return str;
}



/**
 * Thread 属性里（方法可以写） 不能有  Map  set 对象，暂时为解析set  map对象
 * 可以写  array  或  {} 对象，和基本类型
 * 
 * 如要设置全局变量，请在  调用start之前设置，否则跨域内   无法获得数据，修改也一样。
 */
export class Thread extends EventEmitter {
  private worker!: Worker;
  private runFunName: string;
  constructor() {
    super();
    //js的启动事件名（run函数）
    this.runFunName = "$____jkdsfhasjdfhdsjklafhk___kljdas";
  }

  run(...args: Array<any>) {
  }
  /**
   * 多线程异常处理
   * @param e
   */
  private onerror(e: any) {
    throw new Error(
      ["ERROR: Line ", e.lineno, " in ", e.filename, ": ", e.message].join("")
    );
  }
  private $__emit(name: string, ...args: Array<any>) {
    super.emit(name, ...args);
  }
  emit(name: string, ...args: Array<any>) {
    this.worker.postMessage({
      name,
      data: args,
    });
  }
  private onmessage(e: any) {
    var data = e.data;
    this.$__emit(data.name, data.data);
  }
  start(...args: Array<any>) {
    this.__start();
    this.emit(this.runFunName, ...args);
  }

  private __start() {
    if (this.worker) {
      this.close();
    }
    // 生成的js文件
    let js = `
 this.emit = function(name,data){
   postMessage({name:name,data:data});
 }
 let $__currFunMap = {};
 this.on = function(name,fun){
   if(!Array.isArray($__currFunMap[name])){
     $__currFunMap[name] = [];
   }
   $__currFunMap[name].push(fun);
 }
 this.onmessage = function(e){
   var data = e.data;
   let runFunName = "${this.runFunName}";
   if(data.name == runFunName){
     this.run(...data.data);
   }else{
     let objArr = $__currFunMap[data.name];
     if(!objArr){
       return;
     }
     for(let i = 0;i<objArr.length;i++){
       objArr[i] && objArr[i](...data.data);
     }
   }
 }
`;
    //出去的对象数组
    let removeObjArr = [
      "start",
      "__start",
      "close",
      "onerror",
      "$__emit",
      "emit",
      "onmessage",
      this.runFunName,
      "runFunName",
      "_events",
      "_eventsCount",
      "constructor",
      "eventNames",
      "listeners",
      "listenerCount",
      "on",
      "once",
      "removeListener",
      "removeAllListeners",
      "off",
      "addListener",
    ];
    for (let key in this) {
      if (removeObjArr.includes(key)) {
        continue;
      }
      let outObj: any = "";
      if (typeof this[key] == "string") {
        outObj = '"' + this[key] + '"';
      } else if (typeof this[key] == "function") {
        outObj = (<any>this[key]).toString() + ".bind(this)";
      } else if (typeof this[key] == "object") {
        outObj = outObjStrJs(this[key]);
      } else {
        outObj = this[key];
      }
      js += "this." + key + "=" + outObj + ";";
    }

    this.worker = new Worker(window.URL.createObjectURL(new Blob([js])));
    this.worker.onmessage = this.onmessage.bind(this);
    this.worker.onerror = this.onerror.bind(this);
  }
  /**
   * 调用此方法  会从内存中清理出来
   */
  close() {
    this.worker && this.worker.terminate();
  }
}
