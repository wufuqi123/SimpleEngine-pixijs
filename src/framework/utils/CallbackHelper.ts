/**
 * callback帮助类
 */
export class CallbackHelper {
  //callback队列
  private callbackQueue:Array<(value:any,resolve: (value?: any) => void, reject: (reason?: any) => void)=>void> = new Array();
  //是否执行callback队列
  private isExecuteCallbackQueue = false;
  //执行的resolve的值
  private executeValue:any;

  //是否执行过Reject
  private isExecuteReject = false;
  //是否执行Reject
  private isReject = false;
  private rejectValue:any;
  private rejectCallback:((value:any)=>void)|undefined;

  constructor(executor:(resolve: (value?: any) => void, reject: (reason?: any) => void)=>void){
    executor(this.resolve.bind(this),this.reject.bind(this));
  }

  public static builder(executor:(resolve: (value?: any) => void, reject: (reason?: any) => void)=>void):CallbackHelper{
    return new CallbackHelper(executor);
  }

  public then(executor:(value:any,resolve: (value?: any) => void, reject: (reason?: any) => void)=>void):CallbackHelper{
    this.callbackQueue.push(executor);
    if(this.isExecuteCallbackQueue){
      this.resolve(this.executeValue);
    }
    return this;
  }
  public catch(executor:(value:any)=>void):CallbackHelper{
    this.rejectCallback = executor;
    if(this.isReject){
      this.reject(this.rejectValue);
    }
    return this;
  }

  private resolve = (value?: any)=>{
    if(this.isExecuteReject){
      //r如果有reject则不执行
      return;
    }
    this.isExecuteCallbackQueue = true;
    this.executeValue = value;
    let executor = this.callbackQueue.shift();
    if(!executor){
      return;
    }
    this.executeValue = undefined;
    this.isExecuteCallbackQueue = false;
    executor(value,this.resolve,this.reject)
  }
  private reject = (reason?: any)=>{
    this.isReject = true;
    this.rejectValue = reason;
    this.isExecuteReject = true;
    if(this.rejectCallback){ 
      this.isReject = false;
      this.rejectCallback(reason);
    }

  }
}